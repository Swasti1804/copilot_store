"use client"

import { useState } from "react"
import { PageHeader } from "@/components/navigation/page-header"
import { PageTransition } from "@/components/motion/page-transition"
import { StaggerContainer } from "@/components/motion/stagger-container"
import { AnimatedCard } from "@/components/motion/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Car,
  MapPin,
  Calendar,
  Activity,
  Award,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: "active" | "inactive" | "on-break"
  location: string
  vehicle: string
  safetyScore: number
  deliveries: number
  incidents: number
  lastActive: string
  joinDate: string
  certifications: string[]
  riskLevel: "low" | "medium" | "high"
}

interface SafetyMetric {
  category: string
  score: number
  maxScore: number
}

interface Incident {
  id: string
  driverId: string
  driverName: string
  type: string
  severity: "minor" | "moderate" | "severe"
  description: string
  date: string
  status: "reported" | "investigating" | "resolved"
  location: string
}

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@smartstore.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    location: "Downtown Route",
    vehicle: "Truck #001",
    safetyScore: 92,
    deliveries: 156,
    incidents: 1,
    lastActive: "5 minutes ago",
    joinDate: "2023-03-15",
    certifications: ["Defensive Driving", "Hazmat"],
    riskLevel: "low",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@smartstore.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    location: "Suburban Route",
    vehicle: "Van #003",
    safetyScore: 88,
    deliveries: 203,
    incidents: 2,
    lastActive: "12 minutes ago",
    joinDate: "2023-01-20",
    certifications: ["Defensive Driving", "First Aid"],
    riskLevel: "low",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@smartstore.com",
    phone: "+1 (555) 345-6789",
    status: "on-break",
    location: "Industrial Route",
    vehicle: "Truck #002",
    safetyScore: 76,
    deliveries: 89,
    incidents: 4,
    lastActive: "2 hours ago",
    joinDate: "2023-06-10",
    certifications: ["Defensive Driving"],
    riskLevel: "medium",
  },
  {
    id: "4",
    name: "Lisa Chen",
    email: "lisa.chen@smartstore.com",
    phone: "+1 (555) 456-7890",
    status: "inactive",
    location: "Express Route",
    vehicle: "Van #001",
    safetyScore: 65,
    deliveries: 45,
    incidents: 6,
    lastActive: "1 day ago",
    joinDate: "2023-09-05",
    certifications: [],
    riskLevel: "high",
  },
]

const mockIncidents: Incident[] = [
  {
    id: "1",
    driverId: "1",
    driverName: "John Smith",
    type: "Minor Collision",
    severity: "minor",
    description: "Scraped side mirror while backing up in tight parking space",
    date: "2024-01-10",
    status: "resolved",
    location: "Downtown Mall",
  },
  {
    id: "2",
    driverId: "3",
    driverName: "Mike Davis",
    type: "Speeding Violation",
    severity: "moderate",
    description: "Exceeded speed limit by 15 mph on highway",
    date: "2024-01-12",
    status: "investigating",
    location: "Highway 101",
  },
  {
    id: "3",
    driverId: "4",
    driverName: "Lisa Chen",
    type: "Hard Braking",
    severity: "minor",
    description: "Multiple instances of hard braking detected",
    date: "2024-01-14",
    status: "reported",
    location: "City Center",
  },
]

const safetyTrendData = [
  { month: "Jul", score: 85 },
  { month: "Aug", score: 87 },
  { month: "Sep", score: 84 },
  { month: "Oct", score: 89 },
  { month: "Nov", score: 91 },
  { month: "Dec", score: 88 },
  { month: "Jan", score: 92 },
]

const radarData = [
  { category: "Speed Control", score: 85, maxScore: 100 },
  { category: "Braking", score: 92, maxScore: 100 },
  { category: "Acceleration", score: 88, maxScore: 100 },
  { category: "Cornering", score: 90, maxScore: 100 },
  { category: "Following Distance", score: 87, maxScore: 100 },
  { category: "Attention", score: 94, maxScore: 100 },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "on-break":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "moderate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "severe":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "investigating":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reported":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleResolveIncident = (incidentId: string) => {
    setIncidents(
      incidents.map((incident) =>
        incident.id === incidentId ? { ...incident, status: "resolved" as const } : incident,
      ),
    )

    toast({
      title: "Incident Resolved",
      description: "The incident has been marked as resolved.",
    })
  }

  const activeDrivers = drivers.filter((d) => d.status === "active").length
  const averageSafetyScore = Math.round(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length)
  const totalIncidents = incidents.length
  const highRiskDrivers = drivers.filter((d) => d.riskLevel === "high").length

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Driver Safety Management"
          description="Monitor driver performance, safety metrics, and incident management"
        />

        {/* Summary Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedCard index={0}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Drivers</p>
                      <p className="text-2xl font-bold text-green-600">{activeDrivers}</p>
                    </div>
                    <User className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Safety Score</p>
                      <p className="text-2xl font-bold text-blue-600">{averageSafetyScore}</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={2}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Incidents</p>
                      <p className="text-2xl font-bold text-orange-600">{totalIncidents}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={3}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Risk Drivers</p>
                      <p className="text-2xl font-bold text-red-600">{highRiskDrivers}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </StaggerContainer>

        <Tabs defaultValue="drivers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="safety">Safety Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Safety Score</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Incidents</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={driver.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {driver.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-500">{driver.location}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>{driver.status.replace("-", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            {driver.vehicle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress value={driver.safetyScore} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{driver.safetyScore}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(driver.riskLevel)}>{driver.riskLevel} risk</Badge>
                        </TableCell>
                        <TableCell>{driver.deliveries}</TableCell>
                        <TableCell>
                          <span className={driver.incidents > 3 ? "text-red-600 font-medium" : ""}>
                            {driver.incidents}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{driver.lastActive}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Incidents</h2>
              <Badge variant="outline">{incidents.filter((i) => i.status !== "resolved").length} Open Cases</Badge>
            </div>

            <div className="space-y-4">
              {incidents.map((incident, index) => (
                <AnimatedCard key={incident.id} index={index}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{incident.type}</h3>
                            <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                            <Badge className={getIncidentStatusColor(incident.status)}>{incident.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {incident.driverName}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {incident.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {incident.date}
                            </span>
                          </div>
                          <p className="text-sm">{incident.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {incident.status !== "resolved" && (
                            <Button variant="outline" size="sm" onClick={() => handleResolveIncident(incident.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Safety Score Trend</CardTitle>
                  <CardDescription>Average safety score over the last 7 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={safetyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Driver Performance Radar</CardTitle>
                  <CardDescription>Comprehensive safety metrics analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Safety Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {radarData.map((metric, index) => (
                <AnimatedCard key={metric.category} index={index}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{metric.category}</h3>
                          <Badge variant="outline">
                            {metric.score}/{metric.maxScore}
                          </Badge>
                        </div>
                        <Progress value={metric.score} className="h-3" />
                        <div className="flex items-center gap-2 text-sm">
                          {metric.score >= 90 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">Excellent</span>
                            </>
                          ) : metric.score >= 80 ? (
                            <>
                              <Activity className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600">Good</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-orange-500" />
                              <span className="text-orange-600">Needs Improvement</span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Safety Recommendations</CardTitle>
                <CardDescription>Personalized recommendations to improve driver safety</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Award className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Schedule Defensive Driving Training
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      3 drivers would benefit from additional defensive driving courses based on their recent
                      performance metrics.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Monitor High-Risk Routes</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Industrial Route shows higher incident rates. Consider route optimization or additional safety
                      measures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Recognize Top Performers</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      John Smith and Sarah Johnson have maintained excellent safety records. Consider recognition
                      programs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
