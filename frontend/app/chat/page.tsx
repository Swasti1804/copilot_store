"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Send, Bot, User, Lightbulb, ArrowLeft, Sparkles, Clock } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: string
  isLoading?: boolean
}

const suggestedQuestions = [
  {
    question: "What's the current inventory status across all stores?",
    category: "Inventory",
    icon: "📦",
  },
  {
    question: "Which drivers have the highest risk scores today?",
    category: "Safety",
    icon: "🚗",
  },
  {
    question: "Show me the sentiment analysis for this week",
    category: "Analytics",
    icon: "📊",
  },
  {
    question: "What are the top performing stores?",
    category: "Performance",
    icon: "🏆",
  },
  {
    question: "Any weather alerts affecting deliveries?",
    category: "Weather",
    icon: "🌤️",
  },
]

const quickStats = [
  { label: "Active Stores", value: "5", trend: "+2%" },
  { label: "Total Inventory", value: "12,847", trend: "+5%" },
  { label: "Active Drivers", value: "24", trend: "-1" },
  { label: "Sentiment Score", value: "8.2/10", trend: "+0.3" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "👋 Hello! I'm your SmartStore AI assistant. I can help you with inventory management, driver safety, sentiment analysis, and operational insights. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Add loading message
    const loadingMessage: Message = {
      id: messages.length + 2,
      type: "bot",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: generateBotResponse(inputValue),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => prev.slice(0, -1).concat(botResponse))
      setIsLoading(false)
    }, 2000)
  }

  const generateBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("inventory")) {
      return "📊 **Current Inventory Status:**\n\n• **Store #1**: Premium Coffee Beans - 45 units (⚠️ Low stock)\n• **Store #3**: Milk - 15 gallons (🚨 Critical)\n• **Store #4**: Disposable Cups - 80 units (⚠️ Low stock)\n\n**Recommendations:**\n✅ Execute suggested transfers to optimize stock levels\n✅ Set up automated reorder points\n✅ Consider bulk purchasing for high-demand items"
    } else if (lowerQuestion.includes("driver") || lowerQuestion.includes("safety")) {
      return "🚗 **Driver Safety Overview:**\n\n**High-Risk Drivers:**\n• Tom Wilson (VAN-003) - 72% safety score\n  - Recent: Speeding violation today\n  - Action: Immediate coaching required\n\n**Medium-Risk Drivers:**\n• Sarah Davis - 88% safety score\n• David Miller - 78% safety score\n\n**Recommendations:**\n✅ Schedule safety training for Tom Wilson\n✅ Review driving patterns for medium-risk drivers\n✅ Implement real-time coaching alerts"
    } else if (lowerQuestion.includes("sentiment")) {
      return "📈 **Brand Sentiment Analysis:**\n\n**Overall Score: 8.2/10** ⭐\n\n**Positive Highlights:**\n• Seasonal menu receiving great reviews\n• Loyalty program highly appreciated\n• Customer service praised\n\n**Areas for Attention:**\n• Wait times at new location mentioned\n• Some delivery delays reported\n\n**Trending Topics:**\n#PumpkinSpiceLatte #LoyaltyProgram #FastService"
    } else if (lowerQuestion.includes("weather")) {
      return "🌤️ **Weather Impact Report:**\n\n**Active Alerts:**\n• Downtown area: Rain expected (15-20 min delays)\n• Suburban routes: Clear conditions\n\n**Delivery Adjustments:**\n✅ Routes automatically optimized\n✅ Customers notified of potential delays\n✅ Extra drivers on standby\n\n**Recommendations:**\n• Monitor conditions for next 2 hours\n• Consider indoor delivery alternatives"
    } else if (lowerQuestion.includes("performance") || lowerQuestion.includes("store")) {
      return "🏆 **Top Performing Stores Today:**\n\n**1. Store #1 Downtown** 🥇\n• Revenue: $12,450 (+15% vs target)\n• Transactions: 342\n• Avg. Order: $36.40\n\n**2. Store #5 Mall** 🥈\n• Revenue: $9,870\n• High foot traffic area\n\n**3. Store #3 Suburb** 🥉\n• Revenue: $8,320\n• Consistent performance\n\n**Key Success Factors:**\n✅ Efficient operations\n✅ Strategic locations\n✅ Strong customer service"
    } else {
      return "🤖 I can help you with:\n\n📦 **Inventory Management**\n• Stock levels and alerts\n• Transfer recommendations\n• Demand forecasting\n\n🚗 **Driver Safety**\n• Risk assessments\n• Safety scores\n• Incident tracking\n\n📊 **Analytics & Insights**\n• Performance metrics\n• Sentiment analysis\n• Weather impacts\n\nWhat specific information would you like to explore?"
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquare className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              AI Assistant
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </h1>
            <p className="text-muted-foreground">Get instant insights about your franchise operations</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] md:h-[700px] flex flex-col shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                SmartStore AI Assistant
                <Badge variant="secondary" className="ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Online
                </Badge>
              </CardTitle>
              <CardDescription>Ask questions about inventory, drivers, sentiment, and more</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.type === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] md:max-w-[80%] p-4 rounded-2xl ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {message.isLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                            <div
                              className={`flex items-center text-xs ${
                                message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {message.timestamp}
                            </div>
                          </div>
                        )}
                      </div>

                      {message.type === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4 bg-muted/30">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask me anything about your operations..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="flex-1 bg-background border-input focus:border-ring transition-colors"
                    aria-label="Chat message input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="px-4"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send • Shift+Enter for new line
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Suggested Questions */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Quick Questions
              </CardTitle>
              <CardDescription>Try these common queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestedQuestions.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 whitespace-normal bg-background hover:bg-accent hover:text-accent-foreground transition-colors group"
                  onClick={() => handleSuggestedQuestion(item.question)}
                >
                  <div className="flex items-start space-x-2 w-full">
                    <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-medium text-muted-foreground mb-1">{item.category}</div>
                      <div className="text-sm">{item.question}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
              <CardDescription>Real-time overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                  </div>
                  <Badge
                    variant={
                      stat.trend.startsWith("+") ? "default" : stat.trend.startsWith("-") ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {stat.trend}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                I can analyze your data and provide actionable insights for better operations.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/help">View Documentation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
