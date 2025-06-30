"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  MapPin,
  AlertTriangle,
  Zap,
} from "lucide-react"

interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  alerts: WeatherAlert[]
  forecast: ForecastDay[]
}

interface WeatherAlert {
  id: string
  type: "warning" | "watch" | "advisory"
  title: string
  description: string
  severity: "minor" | "moderate" | "severe"
}

interface ForecastDay {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
}

interface WeatherActivity {
  type: "search" | "alert" | "forecast"
  message: string
  timestamp: string
}

const weatherIcons = {
  clear: Sun,
  sunny: Sun,
  cloudy: Cloud,
  "partly cloudy": Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
}

export function WeatherWidget() {
  const [city, setCity] = useState([[]])
  const [inputCity, setInputCity] = useState([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<WeatherActivity[]>([])

  useEffect(() => {
    fetchWeatherData(city)
    const interval = setInterval(() => fetchWeatherData(city), 300000)
    return () => clearInterval(interval)
  }, [city])

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/weather/?city=${cityName}`)
      if (!response.ok) throw new Error("Failed to fetch weather data")
      const data = await response.json()
      const weatherData: WeatherData = {
        location: data.city || cityName,
        temperature: data.temperature,
        condition: data.condition,
        humidity: data.humidity,
        windSpeed: data.wind_speed,
        visibility: data.visibility,
        alerts: data.alerts || [],
        forecast: data.forecast || [],
      }
      setWeather(weatherData)
      setError(null)

      // ✅ Push search activity
      setActivity(prev => [
        {
          type: "search",
          message: `Searched weather for ${cityName}`,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ])

      // ✅ Push alerts activity
      if (weatherData.alerts.length > 0) {
        weatherData.alerts.forEach(alert => {
          setActivity(prev => [
            {
              type: "alert",
              message: `${alert.title} – ${alert.description}`,
              timestamp: new Date().toLocaleTimeString()
            },
            ...prev
          ])
        })
      }

      // ✅ Push risky forecast days
      weatherData.forecast.forEach(day => {
        if (day.precipitation > 60 || day.high > 40 || day.condition.toLowerCase().includes("storm")) {
          setActivity(prev => [
            {
              type: "forecast",
              message: `⚠️ ${day.date}: ${day.condition}, ${day.high}°C, ${day.precipitation}% rain`,
              timestamp: new Date().toLocaleTimeString()
            },
            ...prev
          ])
        }
      })

    } catch (err) {
      console.error(err)
      setError("Weather data not found.")
    } finally {
      setLoading(false)
    }
  }

  const WeatherIcon =
    weather?.condition && typeof weather.condition === "string"
      ? weatherIcons[weather.condition.toLowerCase() as keyof typeof weatherIcons] || Cloud
      : Cloud

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3 space-y-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Weather Impact
          </CardTitle>
          <div className="flex gap-2">
            <Input
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setCity(inputCity)
              }}
              placeholder="Enter city..."
              className="max-w-xs"
            />
            <Button onClick={() => setCity(inputCity)}>Search</Button>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{weather?.location}</span>
            <Badge variant="outline" className="text-xs">Live</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error || !weather ? (
            <div className="text-center text-sm text-red-500">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
              {error || "Weather data unavailable."}
            </div>
          ) : (
            <>
              {/* Current Weather */}
              <motion.div
                className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <WeatherIcon className="h-8 w-8 text-blue-600" />
                  </motion.div>
                  <div>
                    <div className="text-2xl font-bold">{weather.temperature}°C</div>
                    <div className="text-sm text-muted-foreground capitalize">{weather.condition}</div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Droplets className="h-3 w-3" />
                    {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wind className="h-3 w-3" />
                    {weather.windSpeed} mph
                  </div>
                </div>
              </motion.div>

              {/* Alerts */}
              {weather.alerts.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                  {weather.alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === "severe"
                          ? "bg-red-50 border-red-500 dark:bg-red-950/20"
                          : alert.severity === "moderate"
                          ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20"
                          : "bg-blue-50 border-blue-500 dark:bg-blue-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-4 w-4 mt-0.5 ${
                            alert.severity === "severe"
                              ? "text-red-600"
                              : alert.severity === "moderate"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Forecast */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">3-Day Forecast</h4>
                <div className="space-y-2">
                  {weather.forecast.map((day, index) => (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 bg-white/30 dark:bg-gray-800/30 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium w-16">{day.date}</div>
                        <div className="flex items-center gap-1">
                          {React.createElement(
                            weatherIcons[day.condition.toLowerCase() as keyof typeof weatherIcons] || Cloud,
                            { className: "h-4 w-4 text-blue-600" }
                          )}
                          <span className="text-xs text-blue-600">{day.precipitation}%</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{day.high}°</span>
                        <span className="text-muted-foreground">/{day.low}°</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ✅ Recent Activity Section */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-medium">Recent Weather Activity</h4>
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                ) : (
                  <div className="space-y-2">
                    {activity.map((log, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md">
                        {log.type === "search" && <MapPin className="h-4 w-4 text-blue-600" />}
                        {log.type === "alert" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        {log.type === "forecast" && <Zap className="h-4 w-4 text-yellow-600" />}
                        <div className="text-sm flex-1">{log.message}</div>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
