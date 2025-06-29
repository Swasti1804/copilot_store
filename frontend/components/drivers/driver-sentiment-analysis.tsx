"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Brain, TrendingUp, AlertTriangle, Shield, Clock, Target } from "lucide-react"
import { AnimatedCard } from "@/components/motion/animated-card"
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container"

interface DriverBehaviorMetrics {
  driverId: string
  name: string
  vehicle: string
  behaviorScore: number
  riskLevel: "low" | "medium" | "high"
  metrics: {
    speedCompliance: number
    brakingPattern: number
    accelerationSmooth: number
    turningSafety: number
    followingDistance: number
    alertness: number
  }
  recentIncidents: Array<{
    type: string
    severity: "minor" | "moderate" | "severe"
    timestamp: string
    description: string
  }>
  sentimentTrend: Array<{
    date: string
    score: number
    incidents: number
  }>
}

const mockDriverData: DriverBehaviorMetrics[] = [
  {
    driverId: "D001",
    name: "Mike Johnson",
    vehicle: "VAN-001",
    behaviorScore: 85,
    riskLevel: "low",
    metrics: {
      speedCompliance: 92,
      brakingPattern: 88,
      accelerationSmooth: 85,
      turningSafety: 90,
      followingDistance: 87,
      alertness: 94,
    },
    recentIncidents: [],
    sentimentTrend: [
      { date: "Mon", score: 88, incidents: 0 },
      { date: "Tue", score: 85, incidents: 0 },
      { date: "Wed", score: 87, incidents: 0 },
      { date: "Thu", score: 85, incidents: 0 },
      { date: "Fri", score: 85, incidents: 0 },
    ],
  },
  {
    driverId: "D002",
    name: "Tom Wilson",
    vehicle: "VAN-003",
    behaviorScore: 62,
    riskLevel: "high",
    metrics: {
      speedCompliance: 65,
      brakingPattern: 58,
      accelerationSmooth: 60,
      turningSafety: 70,
      followingDistance: 55,
      alertness: 68,
    },
    recentIncidents: [
      {
        type: "Hard Braking",
        severity: "moderate",
        timestamp: "2024-01-15T14:30:00Z",
        description: "Sudden stop at intersection",
      },
      {
        type: "Speeding",
        severity: "severe",
        timestamp: "2024-01-15T09:15:00Z",
        description: "Exceeded speed limit by 15 mph",
      },
    ],
    sentimentTrend: [
      { date: "Mon", score: 70, incidents: 1 },
      { date: "Tue", score: 65, incidents: 2 },
      { date: "Wed", score: 68, incidents: 1 },
      { date: "Thu", score: 60, incidents: 3 },
      { date: "Fri", score: 62, incidents: 2 },
    ],
  },
]

export function DriverSentimentAnalysis() {
  const [selectedDriver, setSelectedDriver] = useState<DriverBehaviorMetrics>(mockDriverData[0])

  const getRadarData = (metrics: DriverBehaviorMetrics["metrics"]) => [
    { subject: "Speed Compliance", A: metrics.speedCompliance, fullMark: 100 },
    { subject: "Braking Pattern", A: metrics.brakingPattern, fullMark: 100 },
    { subject: "Smooth Acceleration", A: metrics.accelerationSmooth, fullMark: 100 },
    { subject: "Turning Safety", A: metrics.turningSafety, fullMark: 100 },
    { subject: "Following Distance", A: metrics.followingDistance, fullMark: 100 },
    { subject: "Alertness", A: metrics.alertness, fullMark: 100 },
  ]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "destructive"
      case "moderate":
        return "secondary"
      case "minor":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6 mt-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Driver Behavior Analysis</h2>
      </motion.div>

      <StaggerContainer className="grid gap-6 lg:grid-cols-2">
        <StaggerItem>
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Driver Selection
              </CardTitle>
              <CardDescription>Select a driver to analyze their behavior patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockDriverData.map((driver) => (
                  <motion.div
                    key={driver.driverId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDriver.driverId === driver.driverId ? "border-primary bg-primary/5" : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{driver.name}</div>
                        <div className="text-sm text-muted-foreground">{driver.vehicle}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getRiskColor(driver.riskLevel)}`}>
                          {driver.behaviorScore}%
                        </div>
                        <Badge
                          variant={
                            driver.riskLevel === "high"
                              ? "destructive"
                              : driver.riskLevel === "medium"
                                ? "secondary"
                                : "default"
                          }
                        >
                          {driver.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Behavior Radar Analysis
              </CardTitle>
              <CardDescription>Comprehensive behavior metrics for {selectedDriver.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData(selectedDriver.metrics)}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      <AnimatedCard delay={0.3}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Detailed Analysis: {selectedDriver.name}
          </CardTitle>
          <CardDescription>In-depth behavior analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="metrics">Behavior Metrics</TabsTrigger>
              <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
              <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(selectedDriver.metrics).map(([key, value]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span
                            className={`text-lg font-bold ${value >= 80 ? "text-green-600" : value >= 60 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            {value}%
                          </span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="incidents" className="space-y-4">
              {selectedDriver.recentIncidents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDriver.recentIncidents.map((incident, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 border rounded-lg"
                    >
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          incident.severity === "severe"
                            ? "text-red-600"
                            : incident.severity === "moderate"
                              ? "text-yellow-600"
                              : "text-blue-600"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{incident.type}</span>
                          <Badge variant={getSeverityColor(incident.severity) as any}>{incident.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(incident.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Recent Incidents</h3>
                  <p className="text-muted-foreground">This driver has maintained excellent safety standards</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedDriver.sentimentTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Behavior Score" />
                      <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} name="Incidents" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-4">
                {selectedDriver.riskLevel === "high" ? (
                  <>
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-900 dark:text-red-100">Immediate Action Required</h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              This driver requires immediate coaching and monitoring due to high-risk behavior patterns.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Recommended Actions</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Schedule immediate safety training</li>
                            <li>• Implement daily check-ins</li>
                            <li>• Consider temporary route restrictions</li>
                            <li>• Increase monitoring frequency</li>
                          </ul>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">Focus Areas</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>• Speed compliance training</li>
                            <li>• Defensive driving techniques</li>
                            <li>• Following distance awareness</li>
                            <li>• Smooth acceleration practices</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-green-900 dark:text-green-100">Excellent Performance</h4>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            This driver demonstrates excellent safety practices and can serve as a mentor for other
                            drivers.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
