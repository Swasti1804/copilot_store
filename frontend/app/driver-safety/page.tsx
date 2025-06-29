"use client"

import { useState, useMemo } from "react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Car,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  Download,
  Bell,
  Map,
  Clock,
  Route,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Navigation,
  Truck,
  Zap,
  Target,
  Gauge,
  FileWarningIcon as Warning,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  currentRoute?: string
  region: string
  company: string
  lat?: number
  lng?: number
}

interface Delivery {
  id: string
  driverId: string
  timestamp: string
  route: string
  status: "completed" | "delayed" | "cancelled"
  duration: string
  distance: string
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

interface SafetyAlert {
  id: string
  type: "risk_driver" | "weather_warning" | "route_hazard" | "vehicle_issue"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  driverId?: string
  driverName?: string
  timestamp: string
  status: "active" | "resolved"
  location?: string
}

interface VehicleReport {
  id: string
  driverId: string
  vehicleId: string
  reportDate: string
  condition: "excellent" | "good" | "fair" | "poor"
  issues: string[]
  mileage: number
  fuelEfficiency: number
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
    currentRoute: "Route A-1",
    region: "North",
    company: "SmartStore Express",
    lat: 40.7128,
    lng: -74.006,
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
    currentRoute: "Route B-2",
    region: "South",
    company: "SmartStore Express",
    lat: 40.6892,
    lng: -74.0445,
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
    currentRoute: "Route C-3",
    region: "East",
    company: "SmartStore Logistics",
    lat: 40.7589,
    lng: -73.9851,
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
    currentRoute: "Route D-4",
    region: "West",
    company: "SmartStore Express",
    lat: 40.7282,
    lng: -73.7949,
  },
  {
    id: "5",
    name: "Tom Wilson",
    email: "tom.wilson@smartstore.com",
    phone: "+1 (555) 567-8901",
    status: "active",
    location: "Highway Route",
    vehicle: "Truck #003",
    safetyScore: 58,
    deliveries: 78,
    incidents: 8,
    lastActive: "30 minutes ago",
    joinDate: "2023-08-12",
    certifications: ["Basic Safety"],
    riskLevel: "high",
    currentRoute: "Route E-5",
    region: "North",
    company: "SmartStore Logistics",
    lat: 40.7505,
    lng: -73.9934,
  },
]

const mockDeliveries: Delivery[] = [
  {
    id: "D001",
    driverId: "1",
    timestamp: "2024-01-15T14:30:00Z",
    route: "Downtown Mall",
    status: "completed",
    duration: "45 min",
    distance: "12.5 km",
  },
  {
    id: "D002",
    driverId: "1",
    timestamp: "2024-01-15T12:15:00Z",
    route: "Business District",
    status: "completed",
    duration: "32 min",
    distance: "8.2 km",
  },
  {
    id: "D003",
    driverId: "1",
    timestamp: "2024-01-15T10:00:00Z",
    route: "Residential Area",
    status: "delayed",
    duration: "65 min",
    distance: "15.1 km",
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
  {
    id: "4",
    driverId: "5",
    driverName: "Tom Wilson",
    type: "Aggressive Driving",
    severity: "severe",
    description: "Rapid acceleration and harsh cornering patterns",
    date: "2024-01-13",
    status: "investigating",
    location: "Industrial Zone",
  },
]

const mockAlerts: SafetyAlert[] = [
  {
    id: "A001",
    type: "risk_driver",
    severity: "high",
    title: "High-Risk Driver Alert",
    description: "Tom Wilson has exceeded safety thresholds with 8 incidents this month",
    driverId: "5",
    driverName: "Tom Wilson",
    timestamp: "2024-01-15T15:30:00Z",
    status: "active",
    location: "Highway Route",
  },
  {
    id: "A002",
    type: "weather_warning",
    severity: "medium",
    title: "Weather Risk Match",
    description: "Heavy rain forecast for Route C-3 with medium-risk driver Mike Davis",
    driverId: "3",
    driverName: "Mike Davis",
    timestamp: "2024-01-15T14:45:00Z",
    status: "active",
    location: "Industrial Route",
  },
  {
    id: "A003",
    type: "route_hazard",
    severity: "medium",
    title: "Route Safety Warning",
    description: "Construction zone detected on Route A-1, recommend alternative path",
    timestamp: "2024-01-15T13:20:00Z",
    status: "active",
    location: "Downtown Route",
  },
  {
    id: "A004",
    type: "vehicle_issue",
    severity: "low",
    title: "Vehicle Maintenance Due",
    description: "Van #003 requires scheduled maintenance check",
    driverId: "2",
    driverName: "Sarah Johnson",
    timestamp: "2024-01-15T12:00:00Z",
    status: "resolved",
    location: "Suburban Route",
  },
]

const mockVehicleReports: VehicleReport[] = [
  {
    id: "VR001",
    driverId: "1",
    vehicleId: "Truck #001",
    reportDate: "2024-01-15",
    condition: "excellent",
    issues: [],
    mileage: 45230,
    fuelEfficiency: 8.5,
  },
  {
    id: "VR002",
    driverId: "2",
    vehicleId: "Van #003",
    reportDate: "2024-01-14",
    condition: "good",
    issues: ["Minor tire wear"],
    mileage: 32150,
    fuelEfficiency: 12.2,
  },
  {
    id: "VR003",
    driverId: "3",
    vehicleId: "Truck #002",
    reportDate: "2024-01-13",
    condition: "fair",
    issues: ["Brake pad wear", "Oil change needed"],
    mileage: 67890,
    fuelEfficiency: 7.8,
  },
]

const safetyTrendData = [
  { month: "Jul", score: 85, incidents: 12 },
  { month: "Aug", score: 87, incidents: 8 },
  { month: "Sep", score: 84, incidents: 15 },
  { month: "Oct", score: 89, incidents: 6 },
  { month: "Nov", score: 91, incidents: 4 },
  { month: "Dec", score: 88, incidents: 9 },
  { month: "Jan", score: 92, incidents: 3 },
]

const riskDistributionData = [
  { name: "Low Risk", value: 60, color: "#10b981" },
  { name: "Medium Risk", value: 25, color: "#f59e0b" },
  { name: "High Risk", value: 15, color: "#ef4444" },
]

const topRiskyDriversData = [
  { name: "Tom Wilson", score: 58, incidents: 8 },
  { name: "Lisa Chen", score: 65, incidents: 6 },
  { name: "Mike Davis", score: 76, incidents: 4 },
  { name: "Sarah Johnson", score: 88, incidents: 2 },
  { name: "John Smith", score: 92, incidents: 1 },
]

export default function DriverSafetyPage() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers)
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [alerts, setAlerts] = useState<SafetyAlert[]>(mockAlerts)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("riskScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { toast } = useToast()

  const filteredDrivers = useMemo(() => {
    const filtered = drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRisk = riskFilter === "all" || driver.riskLevel === riskFilter
      const matchesRegion = regionFilter === "all" || driver.region === regionFilter
      const matchesCompany = companyFilter === "all" || driver.company === companyFilter

      return matchesSearch && matchesRisk && matchesRegion && matchesCompany
    })

    // Sort drivers
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "riskScore":
          aValue = a.safetyScore
          bValue = b.safetyScore
          break
        case "name":
          aValue = a.name
          bValue = b.name
          break
        case "incidents":
          aValue = a.incidents
          bValue = b.incidents
          break
        case "deliveries":
          aValue = a.deliveries
          bValue = b.deliveries
          break
        default:
          aValue = a.safetyScore
          bValue = b.safetyScore
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [drivers, searchTerm, riskFilter, regionFilter, companyFilter, timeFilter, sortBy, sortOrder])

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

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "risk_driver":
        return <AlertTriangle className="h-4 w-4" />
      case "weather_warning":
        return <Warning className="h-4 w-4" />
      case "route_hazard":
        return <Navigation className="h-4 w-4" />
      case "vehicle_issue":
        return <Truck className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))

    toast({
      title: "Alert Resolved",
      description: "The safety alert has been marked as resolved.",
    })
  }

  const handleExportCSV = () => {
    const csvData = filteredDrivers.map((driver) => ({
      Name: driver.name,
      Vehicle: driver.vehicle,
      "Safety Score": driver.safetyScore,
      "Risk Level": driver.riskLevel,
      Incidents: driver.incidents,
      Deliveries: driver.deliveries,
      Region: driver.region,
      Company: driver.company,
      Status: driver.status,
    }))

    const csvContent = [Object.keys(csvData[0]).join(","), ...csvData.map((row) => Object.values(row).join(","))].join(
      "\n",
    )

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "driver-safety-report.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Driver safety report has been exported as CSV.",
    })
  }

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF report generation started. Download will begin shortly.",
    })
  }

  const activeDrivers = drivers.filter((d) => d.status === "active").length
  const averageSafetyScore = Math.round(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length)
  const totalIncidents = incidents.length
  const highRiskDrivers = drivers.filter((d) => d.riskLevel === "high").length
  const activeAlerts = alerts.filter((a) => a.status === "active").length

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Driver Safety Monitor"
          description="Comprehensive driver safety management with real-time monitoring and risk analysis"
        />

        {/* Summary Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

            <AnimatedCard index={4}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                      <p className="text-2xl font-bold text-purple-600">{activeAlerts}</p>
                    </div>
                    <Bell className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </StaggerContainer>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search drivers, vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Risk Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="North">North</SelectItem>
                      <SelectItem value="South">South</SelectItem>
                      <SelectItem value="East">East</SelectItem>
                      <SelectItem value="West">West</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Companies</SelectItem>
                      <SelectItem value="SmartStore Express">SmartStore Express</SelectItem>
                      <SelectItem value="SmartStore Logistics">SmartStore Logistics</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riskScore">Safety Score</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="incidents">Incidents</SelectItem>
                      <SelectItem value="deliveries">Deliveries</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportPDF}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Risk Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Driver Risk Dashboard
                </CardTitle>
                <CardDescription>
                  Showing {filteredDrivers.length} drivers with real-time safety monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Last Route</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Incidents</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
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
                              <div className="text-sm text-gray-500">{driver.company}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-gray-400" />
                            {driver.vehicle}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-gray-400" />
                            {driver.currentRoute}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16">
                              <Progress value={driver.safetyScore} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{driver.safetyScore}</span>
                            <Badge className={getRiskColor(driver.riskLevel)}>
                              {driver.riskLevel === "low" && "🟢"}
                              {driver.riskLevel === "medium" && "🟠"}
                              {driver.riskLevel === "high" && "🔴"}
                              {driver.riskLevel}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)}>{driver.status.replace("-", " ")}</Badge>
                        </TableCell>
                        <TableCell>{driver.region}</TableCell>
                        <TableCell>
                          <span className={driver.incidents > 3 ? "text-red-600 font-medium" : ""}>
                            {driver.incidents}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDriver(driver)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  Driver Profile: {selectedDriver?.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Comprehensive safety analysis and performance history
                                </DialogDescription>
                              </DialogHeader>

                              {selectedDriver && (
                                <div className="space-y-6">
                                  {/* Driver Overview */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card>
                                      <CardContent className="p-4">
                                        <div className="text-center">
                                          <Avatar className="h-16 w-16 mx-auto mb-2">
                                            <AvatarImage src={selectedDriver.avatar || "/placeholder.svg"} />
                                            <AvatarFallback className="text-lg">
                                              {selectedDriver.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <h3 className="font-semibold">{selectedDriver.name}</h3>
                                          <p className="text-sm text-gray-500">{selectedDriver.email}</p>
                                          <Badge className={getRiskColor(selectedDriver.riskLevel)} variant="outline">
                                            {selectedDriver.riskLevel} risk
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Safety Metrics</h4>
                                        <div className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm">Safety Score</span>
                                            <span className="font-medium">{selectedDriver.safetyScore}/100</span>
                                          </div>
                                          <Progress value={selectedDriver.safetyScore} className="h-2" />
                                          <div className="flex justify-between text-sm">
                                            <span>Deliveries: {selectedDriver.deliveries}</span>
                                            <span>Incidents: {selectedDriver.incidents}</span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardContent className="p-4">
                                        <h4 className="font-semibold mb-2">Current Status</h4>
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(selectedDriver.status)}>
                                              {selectedDriver.status}
                                            </Badge>
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            <div>Vehicle: {selectedDriver.vehicle}</div>
                                            <div>Route: {selectedDriver.currentRoute}</div>
                                            <div>Region: {selectedDriver.region}</div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  <Tabs defaultValue="deliveries" className="space-y-4">
                                    <TabsList>
                                      <TabsTrigger value="deliveries">Past Deliveries</TabsTrigger>
                                      <TabsTrigger value="incidents">Incident History</TabsTrigger>
                                      <TabsTrigger value="vehicle">Vehicle Reports</TabsTrigger>
                                      <TabsTrigger value="routes">Route History</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="deliveries" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Recent Deliveries</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {mockDeliveries
                                              .filter((d) => d.driverId === selectedDriver.id)
                                              .map((delivery) => (
                                                <div
                                                  key={delivery.id}
                                                  className="flex items-center justify-between p-3 border rounded-lg"
                                                >
                                                  <div>
                                                    <div className="font-medium">{delivery.route}</div>
                                                    <div className="text-sm text-gray-500">
                                                      {new Date(delivery.timestamp).toLocaleString()}
                                                    </div>
                                                  </div>
                                                  <div className="text-right">
                                                    <Badge
                                                      variant={
                                                        delivery.status === "completed"
                                                          ? "default"
                                                          : delivery.status === "delayed"
                                                            ? "secondary"
                                                            : "destructive"
                                                      }
                                                    >
                                                      {delivery.status}
                                                    </Badge>
                                                    <div className="text-sm text-gray-500">
                                                      {delivery.duration} • {delivery.distance}
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="incidents" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Incident History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {incidents
                                              .filter((incident) => incident.driverId === selectedDriver.id)
                                              .map((incident) => (
                                                <div
                                                  key={incident.id}
                                                  className="flex items-start gap-3 p-3 border rounded-lg"
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
                                                      <Badge className={getSeverityColor(incident.severity)}>
                                                        {incident.severity}
                                                      </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                      <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {incident.location}
                                                      </span>
                                                      <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {incident.date}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="vehicle" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Vehicle Condition Reports</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-3">
                                            {mockVehicleReports
                                              .filter((report) => report.driverId === selectedDriver.id)
                                              .map((report) => (
                                                <div
                                                  key={report.id}
                                                  className="flex items-center justify-between p-3 border rounded-lg"
                                                >
                                                  <div>
                                                    <div className="font-medium">{report.vehicleId}</div>
                                                    <div className="text-sm text-gray-500">{report.reportDate}</div>
                                                    <div className="text-sm">
                                                      Mileage: {report.mileage.toLocaleString()} km
                                                    </div>
                                                  </div>
                                                  <div className="text-right">
                                                    <Badge
                                                      variant={
                                                        report.condition === "excellent"
                                                          ? "default"
                                                          : report.condition === "good"
                                                            ? "secondary"
                                                            : "destructive"
                                                      }
                                                    >
                                                      {report.condition}
                                                    </Badge>
                                                    <div className="text-sm text-gray-500">
                                                      Fuel: {report.fuelEfficiency} L/100km
                                                    </div>
                                                    {report.issues.length > 0 && (
                                                      <div className="text-xs text-red-600 mt-1">
                                                        {report.issues.join(", ")}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="routes" className="space-y-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-lg">Route History Map</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                            <div className="text-center">
                                              <Map className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                              <p className="text-gray-500">
                                                Interactive route map would be displayed here
                                              </p>
                                              <p className="text-sm text-gray-400">
                                                Showing routes for {selectedDriver.name}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Safety Alerts
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {alerts.filter((a) => a.status === "active").length} Active Alerts
              </Badge>
            </div>

            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <AnimatedCard key={alert.id} index={index}>
                  <Card className={`border-l-4 ${getAlertSeverityColor(alert.severity)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {getAlertIcon(alert.type)}
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getAlertSeverityColor(alert.severity)}>{alert.severity}</Badge>
                            <Badge variant={alert.status === "active" ? "destructive" : "default"}>
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {alert.driverName && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {alert.driverName}
                              </span>
                            )}
                            {alert.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {alert.status === "active" && (
                            <Button variant="outline" size="sm" onClick={() => handleResolveAlert(alert.id)}>
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

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Risk Heatmap
                </CardTitle>
                <CardDescription>Interactive map showing route safety and driver locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Risk Heatmap</h3>
                    <p className="text-gray-500 mb-4">Real-time visualization of route safety and driver positions</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Safe Routes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>Moderate Risk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>High Risk</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock driver positions */}
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg">
                    <h4 className="font-semibold mb-2">Active Drivers</h4>
                    <div className="space-y-2">
                      {drivers
                        .filter((d) => d.status === "active")
                        .slice(0, 3)
                        .map((driver) => (
                          <div key={driver.id} className="flex items-center gap-2 text-sm">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                driver.riskLevel === "low"
                                  ? "bg-green-500"
                                  : driver.riskLevel === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <span>{driver.name}</span>
                            <span className="text-gray-500">({driver.currentRoute})</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Safety Score Trend
                  </CardTitle>
                  <CardDescription>Average safety score over the last 7 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={safetyTrendData}>
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
                        name="Safety Score"
                      />
                      <Line
                        type="monotone"
                        dataKey="incidents"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                        name="Incidents"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Risk Distribution
                  </CardTitle>
                  <CardDescription>Fleet risk level breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {riskDistributionData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm">
                          {entry.name}: {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Export Reports
                </CardTitle>
                <CardDescription>Generate comprehensive safety reports for compliance and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">CSV Data Export</h3>
                    <p className="text-sm text-gray-600">
                      Export raw driver data for spreadsheet analysis and custom reporting
                    </p>
                    <Button onClick={handleExportCSV} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV Report
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">PDF Executive Report</h3>
                    <p className="text-sm text-gray-600">
                      Professional formatted report with charts and insights for stakeholders
                    </p>
                    <Button onClick={handleExportPDF} className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate PDF Report
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Report Contents Include:</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Driver safety scores and risk assessments</li>
                    <li>• Incident analysis and trends</li>
                    <li>• Vehicle condition reports</li>
                    <li>• Route safety analysis</li>
                    <li>• Compliance metrics and recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top 5 Risky Drivers
                  </CardTitle>
                  <CardDescription>Drivers requiring immediate attention this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topRiskyDriversData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Safety Improvement Trends
                  </CardTitle>
                  <CardDescription>Monthly safety score improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={safetyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                        name="Safety Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  AI Safety Recommendations
                </CardTitle>
                <CardDescription>Personalized recommendations to improve fleet safety</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100">Immediate Action Required</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      Tom Wilson and Lisa Chen require immediate safety coaching due to high incident rates and low
                      safety scores.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Warning className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Route Optimization</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Industrial Route shows higher incident rates. Consider route optimization or additional safety
                      measures for this area.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Recognition Program</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      John Smith and Sarah Johnson have maintained excellent safety records. Consider implementing a
                      recognition program to motivate other drivers.
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
