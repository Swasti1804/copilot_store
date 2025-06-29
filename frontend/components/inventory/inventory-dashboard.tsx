"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRightLeft,
} from "lucide-react"
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container"
import { AnimatedCard } from "@/components/motion/animated-card"

interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  maxCapacity: number
  unit: string
  cost: number
  supplier: string
  lastRestocked: string
  location: string
  status: "critical" | "low" | "optimal" | "overstocked"
}

interface InventoryMetrics {
  totalItems: number
  totalValue: number
  lowStockItems: number
  criticalItems: number
  turnoverRate: number
  wastePercentage: number
}

const mockInventoryData: InventoryItem[] = [
  {
    id: "1",
    name: "Premium Coffee Beans",
    category: "Beverages",
    currentStock: 45,
    minThreshold: 50,
    maxCapacity: 200,
    unit: "lbs",
    cost: 12.5,
    supplier: "Coffee Co.",
    lastRestocked: "2024-01-15",
    location: "Store #1",
    status: "low",
  },
  {
    id: "2",
    name: "Milk (Whole)",
    category: "Dairy",
    currentStock: 15,
    minThreshold: 25,
    maxCapacity: 100,
    unit: "gallons",
    cost: 3.2,
    supplier: "Dairy Fresh",
    lastRestocked: "2024-01-14",
    location: "Store #2",
    status: "critical",
  },
  {
    id: "3",
    name: "Disposable Cups",
    category: "Supplies",
    currentStock: 80,
    minThreshold: 150,
    maxCapacity: 500,
    unit: "units",
    cost: 0.15,
    supplier: "Supply Pro",
    lastRestocked: "2024-01-10",
    location: "Store #4",
    status: "low",
  },
  {
    id: "4",
    name: "Sugar Packets",
    category: "Supplies",
    currentStock: 200,
    minThreshold: 100,
    maxCapacity: 300,
    unit: "packets",
    cost: 0.05,
    supplier: "Sweet Supply",
    lastRestocked: "2024-01-12",
    location: "Store #1",
    status: "optimal",
  },
]

const categoryData = [
  { name: "Beverages", value: 35, color: "#3b82f6" },
  { name: "Dairy", value: 25, color: "#10b981" },
  { name: "Supplies", value: 30, color: "#f59e0b" },
  { name: "Food", value: 10, color: "#ef4444" },
]

const stockLevelData = [
  { month: "Jan", inStock: 85, lowStock: 12, outOfStock: 3 },
  { month: "Feb", inStock: 88, lowStock: 10, outOfStock: 2 },
  { month: "Mar", inStock: 92, lowStock: 6, outOfStock: 2 },
  { month: "Apr", inStock: 89, lowStock: 8, outOfStock: 3 },
  { month: "May", inStock: 94, lowStock: 5, outOfStock: 1 },
  { month: "Jun", inStock: 91, lowStock: 7, outOfStock: 2 },
]

export function InventoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [metrics, setMetrics] = useState<InventoryMetrics>({
    totalItems: 847,
    totalValue: 45230,
    lowStockItems: 12,
    criticalItems: 3,
    turnoverRate: 8.5,
    wastePercentage: 2.1,
  })

  const filteredInventory = mockInventoryData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "low":
        return "secondary"
      case "optimal":
        return "default"
      case "overstocked":
        return "outline"
      default:
        return "default"
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Monitor stock levels and manage inventory across all locations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </motion.div>

      {/* Metrics Cards */}
      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <AnimatedCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="text-2xl font-bold text-blue-700"
              >
                {metrics.totalItems.toLocaleString()}
              </motion.div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% from last month
              </p>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                className="text-2xl font-bold text-green-700"
              >
                ${metrics.totalValue.toLocaleString()}
              </motion.div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% from last month
              </p>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                className="text-2xl font-bold text-yellow-700"
              >
                {metrics.lowStockItems}
              </motion.div>
              <p className="text-xs text-yellow-600 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3 from yesterday
              </p>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>

        <StaggerItem>
          <AnimatedCard className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                className="text-2xl font-bold text-red-700"
              >
                {metrics.criticalItems}
              </motion.div>
              <p className="text-xs text-red-600">Immediate attention required</p>
            </CardContent>
          </AnimatedCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AnimatedCard delay={0.6}>
          <CardHeader>
            <CardTitle>Stock Level Trends</CardTitle>
            <CardDescription>Monthly inventory status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="inStock" fill="#10b981" name="In Stock" />
                <Bar dataKey="lowStock" fill="#f59e0b" name="Low Stock" />
                <Bar dataKey="outOfStock" fill="#ef4444" name="Out of Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard delay={0.7}>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of items across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Inventory Management */}
      <AnimatedCard delay={0.8}>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your inventory across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="low">Low Stock</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Restocked</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.supplier}</div>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>
                                {item.currentStock} / {item.maxCapacity} {item.unit}
                              </span>
                              <span className="text-muted-foreground">
                                {getStockPercentage(item.currentStock, item.maxCapacity)}%
                              </span>
                            </div>
                            <Progress value={getStockPercentage(item.currentStock, item.maxCapacity)} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status) as any} className="capitalize">
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="critical">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Critical Stock Levels</h3>
                <p className="text-muted-foreground">Items requiring immediate attention</p>
              </div>
            </TabsContent>

            <TabsContent value="low">
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
                <p className="text-muted-foreground">Items that need restocking soon</p>
              </div>
            </TabsContent>

            <TabsContent value="transfers">
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Stock Transfers</h3>
                <p className="text-muted-foreground">Manage transfers between locations</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
