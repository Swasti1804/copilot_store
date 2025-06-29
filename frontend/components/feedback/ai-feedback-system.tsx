"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, CheckCircle, Lightbulb, Bug } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FeedbackItem {
  id: string
  type: "bug" | "feature" | "improvement" | "question"
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "submitted" | "reviewing" | "in-progress" | "resolved"
  timestamp: string
}

export function AIFeedbackSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<string>("")
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedbackList, setShowFeedbackList] = useState(false)

  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([
    {
      id: "1",
      type: "feature",
      title: "Weather alerts integration",
      description: "Would love to see weather alerts integrated with delivery scheduling",
      priority: "medium",
      status: "in-progress",
      timestamp: "2024-01-14T10:30:00Z",
    },
    {
      id: "2",
      type: "bug",
      title: "Chart loading issue",
      description: "Sometimes the inventory charts don't load properly on mobile",
      priority: "high",
      status: "resolved",
      timestamp: "2024-01-13T15:45:00Z",
    },
  ])

  const submitFeedback = async () => {
    if (!feedbackType || !feedbackText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a feedback type and provide details.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      type: feedbackType as any,
      title: feedbackText.split(".")[0] || feedbackText.substring(0, 50),
      description: feedbackText,
      priority:
        feedbackText.toLowerCase().includes("urgent") || feedbackText.toLowerCase().includes("critical")
          ? "high"
          : feedbackText.toLowerCase().includes("important")
            ? "medium"
            : "low",
      status: "submitted",
      timestamp: new Date().toISOString(),
    }

    setFeedbackHistory((prev) => [newFeedback, ...prev])
    setFeedbackType("")
    setFeedbackText("")
    setIsSubmitting(false)
    setIsOpen(false)

    toast({
      title: "Feedback Submitted",
      description: "Thank you! Our AI has analyzed your feedback and assigned it appropriate priority.",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug":
        return <Bug className="h-4 w-4" />
      case "feature":
        return <Lightbulb className="h-4 w-4" />
      case "improvement":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "default"
      case "in-progress":
        return "secondary"
      case "reviewing":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full shadow-lg bg-primary hover:bg-primary/90 h-14 w-14 p-0"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Feedback Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              AI Feedback System
            </DialogTitle>
            <DialogDescription>
              Help us improve SmartStore Copilot. Our AI will analyze your feedback and prioritize it accordingly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Feedback Type</label>
              <Select value={feedbackType} onValueChange={setFeedbackType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">🐛 Bug Report</SelectItem>
                  <SelectItem value="feature">💡 Feature Request</SelectItem>
                  <SelectItem value="improvement">⚡ Improvement Suggestion</SelectItem>
                  <SelectItem value="question">❓ Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Details</label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe your feedback in detail. Our AI will automatically detect priority level and categorize your request."
                rows={4}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => setShowFeedbackList(!showFeedbackList)} size="sm">
                View History ({feedbackHistory.length})
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitFeedback} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Feedback History */}
            <AnimatePresence>
              {showFeedbackList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4 space-y-3 max-h-60 overflow-y-auto"
                >
                  <h4 className="text-sm font-medium">Recent Feedback</h4>
                  {feedbackHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={getPriorityColor(item.priority) as any} className="text-xs">
                            {item.priority}
                          </Badge>
                          <Badge variant={getStatusColor(item.status) as any} className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleDateString()}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
