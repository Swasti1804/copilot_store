"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, Send, Bot, User, Lightbulb, ArrowLeft, Sparkles, Clock } from "lucide-react"
import Link from "next/link"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  timestamp: string
  isLoading?: boolean
}

const suggestedQuestions = [
  { question: "What's the current inventory status across all stores?", category: "Inventory", icon: "📦" },
  { question: "Which drivers have the highest risk scores today?", category: "Safety", icon: "🚗" },
  { question: "Show me the sentiment analysis for this week", category: "Analytics", icon: "📊" },
  { question: "What are the top performing stores?", category: "Performance", icon: "🏆" },
  { question: "Any weather alerts affecting deliveries?", category: "Weather", icon: "🌤️" },
]

const quickStats = [
  { label: "Active Stores", value: "5", trend: "+2%" },
  { label: "Total Inventory", value: "12,847", trend: "+5%" },
  { label: "Active Drivers", value: "24", trend: "-1" },
  { label: "Sentiment Score", value: "8.2/10", trend: "+0.3" },
]

const driverData = [
  {
    name: "John Smith",
    status: "active",
    vehicle: "Truck #001",
    score: 92,
    risk: "low risk",
    deliveries: 156,
    incidents: 1,
    lastActive: "5 minutes ago",
  },
  {
    name: "Sarah Johnson",
    status: "active",
    vehicle: "Van #003",
    score: 88,
    risk: "low risk",
    deliveries: 203,
    incidents: 2,
    lastActive: "12 minutes ago",
  },
  {
    name: "Mike Davis",
    status: "on break",
    vehicle: "Truck #002",
    score: 76,
    risk: "medium risk",
    deliveries: 89,
    incidents: 4,
    lastActive: "2 hours ago",
  },
  {
    name: "Lisa Chen",
    status: "inactive",
    vehicle: "Van #001",
    score: 65,
    risk: "high risk",
    deliveries: 45,
    incidents: 6,
    lastActive: "1 day ago",
  },
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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!listening && transcript.trim()) {
      setInputValue(transcript.trim())
      handleSendMessage(transcript.trim())
      resetTranscript()
    }
  }, [listening])

  const handleSendMessage = async (value?: string) => {
    const messageToSend = value || inputValue
    if (!messageToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    const loadingMessage: Message = {
      id: messages.length + 2,
      type: "bot",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isLoading: true,
    }
    setMessages((prev) => [...prev, loadingMessage])

    const lowerMsg = messageToSend.toLowerCase()

    // 💡 Custom driver query handler
    const handleDriverQuery = (): string | null => {
      if (lowerMsg.includes("high risk")) {
        const highRiskDrivers = driverData.filter((d) => d.risk === "high risk")
        return highRiskDrivers.length
          ? `⚠️ High Risk Driver: ${highRiskDrivers[0].name} (${highRiskDrivers[0].vehicle}) — Safety Score: ${highRiskDrivers[0].score}, Incidents: ${highRiskDrivers[0].incidents}`
          : "No high-risk drivers found."
      }
      if (lowerMsg.includes("best driver") || lowerMsg.includes("top driver")) {
        const best = [...driverData].sort((a, b) => b.score - a.score)[0]
        return `🏅 Best Driver: ${best.name} — Safety Score: ${best.score}, Deliveries: ${best.deliveries}, Vehicle: ${best.vehicle}`
      }
      if (lowerMsg.includes("driver status")) {
        return driverData
          .map((d) => `${d.name}: ${d.status} (${d.lastActive})`)
          .join("\n")
      }
      if (lowerMsg.includes("most deliveries")) {
        const most = [...driverData].sort((a, b) => b.deliveries - a.deliveries)[0]
        return `🚚 Most Deliveries: ${most.name} — ${most.deliveries} deliveries`
      }
      return null
    }

    const driverAnswer = handleDriverQuery()

    if (driverAnswer) {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: driverAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => prev.slice(0, -1).concat(botResponse))
      const utterance = new SpeechSynthesisUtterance(botResponse.content)
      speechSynthesis.speak(utterance)
      setIsLoading(false)
      return
    }

    // 🌐 Otherwise call backend
    try {
      const res = await fetch("http://localhost:8000/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: messageToSend }),
      })

      const data = await res.json()

      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: data.answer || "Sorry, no response from the assistant.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => prev.slice(0, -1).concat(botResponse))
      const utterance = new SpeechSynthesisUtterance(botResponse.content)
      speechSynthesis.speak(utterance)
    } catch (error) {
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "❌ Failed to connect to the assistant.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => prev.slice(0, -1).concat(errorResponse))
    }

    setIsLoading(false)
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
      {/* Header */}
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
        {/* Chat UI */}
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
                {!browserSupportsSpeechRecognition && (
                  <div className="text-red-500 text-sm mb-2">Voice not supported in this browser.</div>
                )}
                <div className="flex space-x-2 items-center">
                  <Button
                    onClick={() => {
                      resetTranscript()
                      SpeechRecognition.startListening({ continuous: false })
                    }}
                    disabled={listening}
                    className="px-3"
                    aria-label="Voice input"
                  >
                    🎤
                  </Button>
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
                    onClick={() => handleSendMessage()}
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
          {/* Quick Questions */}
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

          {/* Stats */}
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
        </div>
      </div>
    </div>
  )
}  