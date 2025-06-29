"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, ArrowRight, Lightbulb } from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  position: "top" | "bottom" | "left" | "right"
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "sidebar",
    title: "Navigation Sidebar",
    description: "Access all your operational tools from this sidebar. Click on any item to navigate.",
    target: "[data-onboarding='sidebar']",
    position: "right",
  },
  {
    id: "search",
    title: "Quick Search",
    description: "Search across all your operations data quickly using this search bar.",
    target: "[data-onboarding='search']",
    position: "bottom",
  },
  {
    id: "notifications",
    title: "Real-time Alerts",
    description: "Stay updated with important notifications about your operations.",
    target: "[data-onboarding='notifications']",
    position: "bottom",
  },
]

export function OnboardingTooltip() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem("smartstore-onboarding-completed")
    if (!seen) {
      setHasSeenOnboarding(false)
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("smartstore-onboarding-completed", "true")
    setHasSeenOnboarding(true)
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (hasSeenOnboarding || !isVisible) return null

  const step = onboardingSteps[currentStep]

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Card className="w-80 shadow-2xl border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {onboardingSteps.length}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleSkip}>
                  Skip Tour
                </Button>
                <Button size="sm" onClick={handleNext}>
                  {currentStep === onboardingSteps.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
