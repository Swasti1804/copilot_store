"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WifiOff, RefreshCw, Store } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SmartStore Copilot</span>
          </div>
          <div className="flex justify-center mb-4">
            <WifiOff className="h-16 w-16 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            No internet connection detected. Some features may be limited while offline.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Don't worry! You can still access cached data and previously viewed pages.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <div className="text-xs text-gray-500">
            <p>Available offline:</p>
            <ul className="mt-2 space-y-1">
              <li>• Dashboard overview</li>
              <li>• Cached inventory data</li>
              <li>• Previous chat conversations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
