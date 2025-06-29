"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Settings, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error("Error checking subscription:", error)
      }
    }
  }

  const requestPermission = async () => {
    setIsLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToNotifications()
        toast({
          title: "Notifications enabled",
          description: "You'll receive alerts for important updates",
        })
      } else {
        toast({
          title: "Notifications blocked",
          description: "You can enable them later in browser settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready

        // In a real app, you'd get this from your server
        const vapidPublicKey = "your-vapid-public-key"

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        })

        setIsSubscribed(true)

        // Send subscription to your server
        console.log("Push subscription:", subscription)

        // Simulate sending to server
        // await fetch('/api/subscribe', {
        //   method: 'POST',
        //   body: JSON.stringify(subscription),
        //   headers: { 'Content-Type': 'application/json' }
        // })
      } catch (error) {
        console.error("Error subscribing to notifications:", error)
      }
    }
  }

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true)
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
          await subscription.unsubscribe()
          setIsSubscribed(false)
          toast({
            title: "Notifications disabled",
            description: "You won't receive push notifications anymore",
          })
        }
      }
    } catch (error) {
      console.error("Error unsubscribing:", error)
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("SmartStore Alert", {
        body: "This is a test notification from SmartStore Copilot",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: "test-notification",
      })
    }
  }

  if (!("Notification" in window)) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <Smartphone className="h-4 w-4 text-primary" />
          </div>
          Notifications
        </CardTitle>
        <CardDescription className="text-sm">Stay updated with real-time alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${
                permission === "granted" ? "bg-green-500" : permission === "denied" ? "bg-red-500" : "bg-yellow-500"
              }`}
            />
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-muted-foreground">
                {permission === "granted" ? "Active" : permission === "denied" ? "Blocked" : "Not set"}
              </p>
            </div>
          </div>
          <Badge
            variant={permission === "granted" ? "default" : permission === "denied" ? "destructive" : "secondary"}
            className="text-xs"
          >
            {permission === "granted" ? "On" : permission === "denied" ? "Off" : "Setup"}
          </Badge>
        </div>

        <div className="space-y-2">
          {permission === "default" && (
            <Button onClick={requestPermission} disabled={isLoading} className="w-full h-9" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Enable Alerts
            </Button>
          )}

          {permission === "granted" && !isSubscribed && (
            <Button onClick={subscribeToNotifications} disabled={isLoading} className="w-full h-9" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          )}

          {permission === "granted" && isSubscribed && (
            <div className="space-y-2">
              <Button onClick={sendTestNotification} variant="outline" size="sm" className="w-full h-9 bg-transparent">
                Test Alert
              </Button>
              <Button
                onClick={unsubscribeFromNotifications}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className="w-full h-8 text-xs"
              >
                <BellOff className="h-3 w-3 mr-2" />
                Unsubscribe
              </Button>
            </div>
          )}

          {permission === "denied" && (
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <Settings className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-red-700 dark:text-red-400">Enable in browser settings</p>
            </div>
          )}
        </div>

        {permission === "granted" && (
          <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <p className="font-medium mb-1">Alert types:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>• Low inventory</div>
              <div>• Driver safety</div>
              <div>• Weather alerts</div>
              <div>• Sentiment changes</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
