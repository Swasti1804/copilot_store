"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WeatherWidget } from "@/components/weather/weather-widget"
import { WeatherAutomation } from "@/components/weather/weather-automation"
import {
  Thermometer, Droplets, Wind, Sun, AlertTriangle,
  MapPin, Settings, Zap, Activity
} from "lucide-react"

export default function WeatherPage() {
  const [city] = useState("Delhi")
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    
  fetch("http://localhost:8000/api/weather/?city=Delhi")

      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then((data) => {
        setWeatherData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Fetch error:", err)
        setError("Unable to load weather data.")
        setLoading(false)
      })
  }, [city])

  if (loading) return <p className="text-gray-500 text-sm">Loading weather data...</p>
  if (error) return <p className="text-red-500 text-sm">{error}</p>
  if (!weatherData) return <p className="text-yellow-500 text-sm">No weather data available.</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weather Management</h1>
          <p className="text-gray-600">Monitor weather conditions and manage automated responses</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>Live Monitoring</span>
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Weather Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="text-2xl font-bold">{weatherData?.current?.temperature}°F</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-2xl font-bold">{weatherData?.current?.humidity}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Wind className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-2xl font-bold">{weatherData?.current?.windSpeed} mph</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">UV Index</p>
              <p className="text-2xl font-bold">{weatherData?.current?.uvIndex}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {weatherData?.alerts?.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Active Weather Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {weatherData.alerts.map((alert: any) => (
              <div key={alert.id} className="flex justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                    {alert.severity}
                  </Badge>
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{alert.location}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest weather-related events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Automation Triggered</p>
                    <p className="text-xs text-gray-600">High wind alert activated</p>
                  </div>
                  <span className="text-xs text-gray-500">2 min ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <WeatherAutomation />
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <h3 className="text-lg font-semibold">Store Locations</h3>
          <p className="text-sm text-gray-600">Weather across all locations</p>
          <div className="grid gap-4">
            {weatherData?.locations?.map((location: any) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="font-semibold">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.condition}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-bold">{location.temp}°F</p>
                      {location.alerts > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {location.alerts} alert{location.alerts > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <h3 className="text-lg font-semibold">Supplier Status</h3>
          <p className="text-sm text-gray-600">Impact on suppliers</p>
          <div className="grid gap-4">
            {weatherData?.suppliers?.map((supplier: any) => (
              <Card key={supplier.id}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{supplier.name}</h4>
                    <p className="text-sm text-gray-600">Last contact: {supplier.lastContact}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                      {supplier.status}
                    </Badge>
                    <Button variant="outline" size="sm">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
