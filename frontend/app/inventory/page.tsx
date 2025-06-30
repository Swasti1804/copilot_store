"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import VoiceAssistant from "@/components/VoiceAssistant"  // adjust path if needed
import { toast } from "@/components/ui/use-toast"


import { PageHeader } from "@/components/navigation/page-header"
import { PageTransition } from "@/components/motion/page-transition"
import { StaggerContainer } from "@/components/motion/stagger-container"
import { AnimatedCard } from "@/components/motion/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"



import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Package,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Search,
  Download,
  Upload,
  Truck,
  BarChart3,
  ShoppingCart,
  Bell,
  FileText,
  Mail,
  Phone,
  RefreshCw,
  MoreHorizontal,
  AlertCircle,
  User,
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  reorderPoint: number
  reorderQuantity: number
  location: string
  lastUpdated: string
  status: "in-stock" | "low-stock" | "out-of-stock" | "overstocked" | "reorder-pending"
  price: number
  supplier: string
  supplierContact: string
  lastOrderDate?: string
  leadTime: number // days
  isSelected?: boolean
}

interface Transfer {
  id: string
  item: string
  fromStore: string
  toStore: string
  quantity: number
  status: "pending" | "in-transit" | "completed" | "cancelled"
  requestedDate: string
  estimatedArrival?: string
  priority: "low" | "medium" | "high"
}

interface ReorderRequest {
  id: string
  itemId: string
  itemName: string
  supplier: string
  quantity: number
  estimatedCost: number
  urgency: "low" | "medium" | "high" | "critical"
  requestedBy: string
  requestedDate: string
  status: "pending" | "approved" | "ordered" | "delivered"
  notes?: string
}



const mockTransfers: Transfer[] = [
  {
    id: "1",
    item: "Premium Coffee Beans",
    fromStore: "Store #003",
    toStore: "Store #001",
    quantity: 25,
    status: "in-transit",
    requestedDate: "2024-01-15",
    estimatedArrival: "2024-01-16",
    priority: "medium",
  },
]

const mockReorders: ReorderRequest[] = [
  {
    id: "1",
    itemId: "3",
    itemName: "Artisan Bread",
    supplier: "Local Bakery",
    quantity: 25,
    estimatedCost: 174.75,
    urgency: "critical",
    requestedBy: "System Auto-Reorder",
    requestedDate: "2024-01-15",
    status: "pending",
    notes: "Critical stock-out situation. Customer demand high.",
  },
  {
    id: "2",
    itemId: "5",
    itemName: "Sandwich Wraps",
    supplier: "Fresh Foods Inc",
    quantity: 40,
    estimatedCost: 359.6,
    urgency: "high",
    requestedBy: "Store Manager",
    requestedDate: "2024-01-15",
    status: "approved",
    notes: "Popular lunch item, need immediate restocking.",
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers)
  const [reorders, setReorders] = useState<ReorderRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [transferForm, setTransferForm] = useState({
    toStore: "",
    quantity: 0,
    priority: "medium" as "low" | "medium" | "high",
  })
  const [reorderForm, setReorderForm] = useState({
    quantity: 0,
    urgency: "medium" as "low" | "medium" | "high" | "critical",
    notes: "",
  })
  const [notificationForm, setNotificationForm] = useState({
    recipients: "",
    subject: "",
    message: "",
    method: "email" as "email" | "sms" | "both",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
 const handleVoiceCommand = (cmd: string) => {
  const command = cmd.toLowerCase()
  console.log("🎤 Voice Command:", command)

  if (command.includes("import")) {
    setIsImportDialogOpen(true)
  } else if (command.includes("notify") || command.includes("alert")) {
    setIsNotificationDialogOpen(true)
  } else if (command.includes("reorder")) {
    const itemToReorder = inventory.find((item) => item.status === "out-of-stock")
    if (itemToReorder) {
      handleAutoReorder(itemToReorder)
    }
    toast({
      title: "Voice Command Triggered",
      description: "Auto reorder initiated for out-of-stock items.",
    })
  } else if (command.includes("stock status")) {
    toast({
      title: "Stock Overview",
      description: `${outOfStockItems.length} out of stock, ${lowStockItems.length} low stock items.`,
    })
  } else if (command.includes("total value")) {
    toast({
      title: "Inventory Value",
      description: `Total inventory value: $${totalValue.toLocaleString()}`,
    })
  } else {
    toast({
      title: "Unrecognized Command",
      description: `I couldn't understand "${cmd}". Try saying "import", "reorder", or "stock status".`,
    })
  }
}

  useEffect(() => {
    // Fetch inventory from backend API when component mounts
    async function fetchInventory() {
      try {
           const response = await fetch("http://localhost:8000/api/inventory/status")
        if (!response.ok) {
          throw new Error(`Error fetching inventory: ${response.statusText}`)
        }
        const data = await response.json()
        if (data.status === "success") {
          setInventory(data.inventory)
        } else {
          toast({
            title: "Failed to load inventory",
            description: data.message || "Unknown error",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch inventory",
          variant: "destructive",
        })
      }
    }
     async function fetchReorders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/reorders/list")
        if (!response.ok) throw new Error("Failed to fetch reorders")
        const data = await response.json()
        setReorders(data || [])
      } catch (error) {
        toast({ title: "Error", description: "Unable to load reorder data" })
      }
    }

    fetchInventory()
    fetchReorders()
  }, [])

  
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "out-of-stock":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "overstocked":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "reorder-pending":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStockPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100)
  }

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(inventory.map((item) => item.category)))]
  const outOfStockItems = inventory.filter((item) => item.status === "out-of-stock")
  const lowStockItems = inventory.filter((item) => item.status === "low-stock" || item.status === "out-of-stock")
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.price, 0)
  const pendingReorders = reorders.filter((r) => r.status === "pending" || r.status === "approved")

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredInventory.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleExecuteTransfer = () => {
    if (!selectedItem || !transferForm.toStore || transferForm.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (transferForm.quantity > selectedItem.currentStock) {
      toast({
        title: "Error",
        description: "Transfer quantity cannot exceed current stock.",
        variant: "destructive",
      })
      return
    }

    const newTransfer: Transfer = {
      id: Date.now().toString(),
      item: selectedItem.name,
      fromStore: selectedItem.location,
      toStore: transferForm.toStore,
      quantity: transferForm.quantity,
      status: "pending",
      requestedDate: new Date().toISOString().split("T")[0],
      priority: transferForm.priority,
    }

    setTransfers([...transfers, newTransfer])
    setInventory(
      inventory.map((item) =>
        item.id === selectedItem.id ? { ...item, currentStock: item.currentStock - transferForm.quantity } : item,
      ),
    )

    setIsTransferDialogOpen(false)
    setTransferForm({ toStore: "", quantity: 0, priority: "medium" })
    setSelectedItem(null)

    toast({
      title: "Transfer Initiated",
      description: `Transfer of ${transferForm.quantity} ${selectedItem.name} to ${transferForm.toStore} has been initiated.`,
    })
  }

  const handleCreateReorder = () => {
    if (!selectedItem || reorderForm.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity.",
        variant: "destructive",
      })
      return
    }

    const newReorder: ReorderRequest = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      supplier: selectedItem.supplier,
      quantity: reorderForm.quantity,
      estimatedCost: reorderForm.quantity * selectedItem.price,
      urgency: reorderForm.urgency,
      requestedBy: "Manual Request",
      requestedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: reorderForm.notes,
    }

    setReorders([...reorders, newReorder])
    setInventory(
      inventory.map((item) => (item.id === selectedItem.id ? { ...item, status: "reorder-pending" as const } : item)),
    )

    setIsReorderDialogOpen(false)
    setReorderForm({ quantity: 0, urgency: "medium", notes: "" })
    setSelectedItem(null)

    toast({
      title: "Reorder Request Created",
      description: `Reorder request for ${reorderForm.quantity} ${selectedItem.name} has been submitted.`,
    })
  }

  const handleAutoReorder = (item: InventoryItem) => {
    const autoReorder: ReorderRequest = {
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      supplier: item.supplier,
      quantity: item.reorderQuantity,
      estimatedCost: item.reorderQuantity * item.price,
      urgency: item.status === "out-of-stock" ? "critical" : "high",
      requestedBy: "Auto-Reorder System",
      requestedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: `Automatic reorder triggered. Stock level: ${item.currentStock}, Reorder point: ${item.reorderPoint}`,
    }

    setReorders([...reorders, autoReorder])
    setInventory(inventory.map((i) => (i.id === item.id ? { ...i, status: "reorder-pending" as const } : i)))

    toast({
      title: "Auto-Reorder Triggered",
      description: `Automatic reorder for ${item.reorderQuantity} ${item.name} has been created.`,
    })
  }

  const handleSendNotification = () => {
    if (!notificationForm.recipients || !notificationForm.subject || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all notification fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate sending notification
    setTimeout(() => {
      toast({
        title: "Notification Sent",
        description: `${notificationForm.method === "both" ? "Email and SMS" : notificationForm.method} notification sent to ${notificationForm.recipients}.`,
      })
    }, 1000)

    setIsNotificationDialogOpen(false)
    setNotificationForm({ recipients: "", subject: "", message: "", method: "email" })
  }

  const handleExport = (format: "csv" | "excel" | "json") => {
    const data = selectedItems.length > 0 ? inventory.filter((item) => selectedItems.includes(item.id)) : inventory

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (format) {
      case "csv":
        const csvHeaders = "SKU,Name,Category,Current Stock,Min Stock,Max Stock,Status,Price,Supplier,Location\n"
        const csvRows = data
          .map(
            (item) =>
              `${item.sku},"${item.name}",${item.category},${item.currentStock},${item.minStock},${item.maxStock},${item.status},${item.price},"${item.supplier}","${item.location}"`,
          )
          .join("\n")
        content = csvHeaders + csvRows
        filename = "inventory_export.csv"
        mimeType = "text/csv"
        break

      case "excel":
        // For demo purposes, we'll export as CSV with .xlsx extension
        const excelHeaders =
          "SKU\tName\tCategory\tCurrent Stock\tMin Stock\tMax Stock\tStatus\tPrice\tSupplier\tLocation\n"
        const excelRows = data
          .map(
            (item) =>
              `${item.sku}\t${item.name}\t${item.category}\t${item.currentStock}\t${item.minStock}\t${item.maxStock}\t${item.status}\t${item.price}\t${item.supplier}\t${item.location}`,
          )
          .join("\n")
        content = excelHeaders + excelRows
        filename = "inventory_export.xlsx"
        mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        break

      case "json":
        content = JSON.stringify(data, null, 2)
        filename = "inventory_export.json"
        mimeType = "application/json"
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: `Inventory data exported as ${format.toUpperCase()} format.`,
    })
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let importedData: any[] = []

        if (file.name.endsWith(".json")) {
          importedData = JSON.parse(content)
        } else if (file.name.endsWith(".csv")) {
          const lines = content.split("\n")
          const headers = lines[0].split(",")
          importedData = lines
            .slice(1)
            .map((line) => {
              const values = line.split(",")
              const item: any = {}
              headers.forEach((header, index) => {
                item[header.trim()] = values[index]?.replace(/"/g, "").trim()
              })
              return item
            })
            .filter((item) => item.SKU) // Filter out empty rows
        }

        // Validate and merge imported data
        const validatedData = importedData.map((item, index) => ({
          id: item.id || `imported-${Date.now()}-${index}`,
          name: item.Name || item.name || `Imported Item ${index + 1}`,
          sku: item.SKU || item.sku || `IMP-${index + 1}`,
          category: item.Category || item.category || "Imported",
          currentStock: Number.parseInt(item["Current Stock"] || item.currentStock || "0"),
          minStock: Number.parseInt(item["Min Stock"] || item.minStock || "10"),
          maxStock: Number.parseInt(item["Max Stock"] || item.maxStock || "100"),
          reorderPoint: Number.parseInt(item["Reorder Point"] || item.reorderPoint || "20"),
          reorderQuantity: Number.parseInt(item["Reorder Quantity"] || item.reorderQuantity || "50"),
          location: item.Location || item.location || "Imported Location",
          lastUpdated: "Just imported",
          status: item.Status || item.status || "in-stock",
          price: Number.parseFloat(item.Price || item.price || "0"),
          supplier: item.Supplier || item.supplier || "Unknown Supplier",
          supplierContact: item["Supplier Contact"] || item.supplierContact || "",
          leadTime: Number.parseInt(item["Lead Time"] || item.leadTime || "3"),
        }))

        setInventory([...inventory, ...validatedData])
        setIsImportDialogOpen(false)

        toast({
          title: "Import Successful",
          description: `Successfully imported ${validatedData.length} items.`,
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to parse the imported file. Please check the format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Inventory Management"
          description="Monitor stock levels, manage transfers, and optimize inventory across all locations"
            
        />

        {/* Out of Stock Alert Banner */}
        {outOfStockItems.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-300">
                      {outOfStockItems.length} Items Out of Stock
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Immediate attention required: {outOfStockItems.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsNotificationDialogOpen(true)}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notify Staff
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      outOfStockItems.forEach((item) => handleAutoReorder(item))
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Auto-Reorder All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <AnimatedCard index={0}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
                      <p className="text-2xl font-bold">{inventory.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={2}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={3}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reorders</p>
                      <p className="text-2xl font-bold text-purple-600">{pendingReorders.length}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={4}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                      <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </StaggerContainer>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="inventory">Current Inventory</TabsTrigger>
            <TabsTrigger value="reorders">Reorder Management</TabsTrigger>
            <TabsTrigger value="transfers">Active Transfers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Excel Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("json")}>
                      <FileText className="h-4 w-4 mr-2" />
                      JSON Format
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>

                {selectedItems.length > 0 && (
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Bulk Actions ({selectedItems.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Inventory Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow
                        key={item.id}
                        className={item.status === "out-of-stock" ? "bg-red-50 dark:bg-red-950/10" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {item.name}
                              {item.status === "out-of-stock" && <AlertCircle className="h-4 w-4 text-red-500" />}
                            </div>
                            <div className="text-sm text-gray-500">${item.price}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>
                                {item.currentStock}/{item.maxStock}
                              </span>
                              <span>{Math.round(getStockPercentage(item.currentStock, item.maxStock))}%</span>
                            </div>
                            <Progress
                              value={getStockPercentage(item.currentStock, item.maxStock)}
                              className={`h-2 ${item.status === "out-of-stock" ? "bg-red-200" : ""}`}
                            />
                            <div className="text-xs text-gray-500">
                              Min: {item.minStock} | Reorder: {item.reorderPoint}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.supplier}</div>
                            <div className="text-xs text-gray-500">Lead: {item.leadTime} days</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item)
                                  setIsTransferDialogOpen(true)
                                }}
                                disabled={item.currentStock === 0}
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Transfer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item)
                                  setReorderForm({
                                    quantity: item.reorderQuantity,
                                    urgency: item.status === "out-of-stock" ? "critical" : "medium",
                                    notes: "",
                                  })
                                  setIsReorderDialogOpen(true)
                                }}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Reorder
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAutoReorder(item)}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Auto-Reorder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setNotificationForm({
                                    recipients: item.supplierContact,
                                    subject: `Urgent: Restock Required - ${item.name}`,
                                    message: `Dear ${item.supplier},\n\nWe urgently need to restock ${item.name} (SKU: ${item.sku}).\nCurrent stock: ${item.currentStock}\nReorder quantity: ${item.reorderQuantity}\n\nPlease confirm availability and delivery timeline.\n\nBest regards,\nInventory Management Team`,
                                    method: "email",
                                  })
                                  setIsNotificationDialogOpen(true)
                                }}
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Supplier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reorders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reorder Management</h2>
              <Badge variant="outline">{pendingReorders.length} Pending Approval</Badge>
            </div>

            <div className="space-y-4">
              {reorders.map((reorder, index) => (
                <AnimatedCard key={reorder.id} index={index}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{reorder.itemName}</h3>
                            <Badge className={getUrgencyColor(reorder.urgency)}>{reorder.urgency} urgency</Badge>
                            <Badge variant="outline">{reorder.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>Supplier: {reorder.supplier}</span>
                            <span>Qty: {reorder.quantity}</span>
                            <span>Cost: ${reorder.estimatedCost.toFixed(2)}</span>
                            <span>Requested: {reorder.requestedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <User className="h-4 w-4" />
                            <span>By: {reorder.requestedBy}</span>
                          </div>
                          {reorder.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                              {reorder.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {reorder.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReorders(
                                    reorders.map((r) =>
                                      r.id === reorder.id ? { ...r, status: "approved" as const } : r,
                                    ),
                                  )
                                  toast({
                                    title: "Reorder Approved",
                                    description: `Reorder for ${reorder.itemName} has been approved.`,
                                  })
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReorders(reorders.filter((r) => r.id !== reorder.id))
                                  toast({
                                    title: "Reorder Cancelled",
                                    description: `Reorder for ${reorder.itemName} has been cancelled.`,
                                  })
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          {reorder.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setReorders(
                                  reorders.map((r) => (r.id === reorder.id ? { ...r, status: "ordered" as const } : r)),
                                )
                                toast({
                                  title: "Order Placed",
                                  description: `Order for ${reorder.itemName} has been placed with supplier.`,
                                })
                              }}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Place Order
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

          <TabsContent value="transfers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Transfers</h2>
              <Badge variant="outline">
                {transfers.filter((t) => t.status !== "completed" && t.status !== "cancelled").length} Active
              </Badge>
            </div>

            <div className="space-y-4">
              {transfers.map((transfer, index) => (
                <AnimatedCard key={transfer.id} index={index}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{transfer.item}</h3>
                            <Badge variant="outline">{transfer.status.replace("-", " ")}</Badge>
                            <Badge
                              variant="outline"
                              className={
                                transfer.priority === "high"
                                  ? "border-red-500 text-red-500"
                                  : transfer.priority === "medium"
                                    ? "border-yellow-500 text-yellow-500"
                                    : "border-green-500 text-green-500"
                              }
                            >
                              {transfer.priority} priority
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>
                              {transfer.fromStore} → {transfer.toStore}
                            </span>
                            <span>Qty: {transfer.quantity}</span>
                            <span>Requested: {transfer.requestedDate}</span>
                            {transfer.estimatedArrival && <span>ETA: {transfer.estimatedArrival}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {transfer.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setTransfers(
                                  transfers.map((t) =>
                                    t.id === transfer.id ? { ...t, status: "in-transit" as const } : t,
                                  ),
                                )
                                toast({
                                  title: "Transfer Started",
                                  description: `Transfer of ${transfer.item} is now in transit.`,
                                })
                              }}
                            >
                              <Truck className="h-4 w-4 mr-2" />
                              Start Transfer
                            </Button>
                          )}
                          {transfer.status === "in-transit" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setTransfers(
                                  transfers.map((t) =>
                                    t.id === transfer.id ? { ...t, status: "completed" as const } : t,
                                  ),
                                )
                                toast({
                                  title: "Transfer Completed",
                                  description: `Transfer of ${transfer.item} has been completed.`,
                                })
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Delivered
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
            <Card>
              <CardHeader>
                <CardTitle>Inventory Analytics</CardTitle>
                <CardDescription>Insights and trends for inventory optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Advanced analytics charts would be displayed here
                    </p>
                    <p className="text-sm text-gray-400">
                      Including turnover rates, demand forecasting, and optimization suggestions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transfer Dialog */}
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Execute Transfer</DialogTitle>
              <DialogDescription>
                Transfer {selectedItem?.name} from {selectedItem?.location}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="toStore">Destination Store</Label>
                <Select
                  value={transferForm.toStore}
                  onValueChange={(value) => setTransferForm({ ...transferForm, toStore: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination store" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Store #001">Store #001 - New York</SelectItem>
                    <SelectItem value="Store #002">Store #002 - Los Angeles</SelectItem>
                    <SelectItem value="Store #003">Store #003 - Chicago</SelectItem>
                    <SelectItem value="Store #004">Store #004 - Miami</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={selectedItem?.currentStock || 0}
                  value={transferForm.quantity}
                  onChange={(e) =>
                    setTransferForm({
                      ...transferForm,
                      quantity: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter quantity to transfer"
                />
                <p className="text-xs text-gray-500 mt-1">Available: {selectedItem?.currentStock || 0} units</p>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={transferForm.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setTransferForm({ ...transferForm, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleExecuteTransfer}>Execute Transfer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reorder Dialog */}
        <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Reorder Request</DialogTitle>
              <DialogDescription>
                Request reorder for {selectedItem?.name} from {selectedItem?.supplier}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Stock</Label>
                  <Input value={selectedItem?.currentStock || 0} disabled />
                </div>
                <div>
                  <Label>Reorder Point</Label>
                  <Input value={selectedItem?.reorderPoint || 0} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
                <Input
                  id="reorderQuantity"
                  type="number"
                  min="1"
                  value={reorderForm.quantity}
                  onChange={(e) =>
                    setReorderForm({
                      ...reorderForm,
                      quantity: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter quantity to reorder"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suggested: {selectedItem?.reorderQuantity || 0} units
                  {selectedItem && (
                    <span> • Estimated cost: ${(reorderForm.quantity * selectedItem.price).toFixed(2)}</span>
                  )}
                </p>
              </div>
              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={reorderForm.urgency}
                  onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                    setReorderForm({ ...reorderForm, urgency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Standard delivery</SelectItem>
                    <SelectItem value="medium">Medium - Priority delivery</SelectItem>
                    <SelectItem value="high">High - Express delivery</SelectItem>
                    <SelectItem value="critical">Critical - Emergency delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={reorderForm.notes}
                  onChange={(e) => setReorderForm({ ...reorderForm, notes: e.target.value })}
                  placeholder="Add any special instructions or notes..."
                  rows={3}
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Supplier:</span>
                    <span className="font-medium">{selectedItem?.supplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Time:</span>
                    <span className="font-medium">{selectedItem?.leadTime} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-medium">{selectedItem?.supplierContact}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReorderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReorder}>Create Reorder Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Inventory Data</DialogTitle>
              <DialogDescription>Upload a CSV, Excel, or JSON file to import inventory items</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleImport}
                  ref={fileInputRef}
                />
                <p className="text-xs text-gray-500 mt-1">Supported formats: CSV, Excel (.xlsx, .xls), JSON</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Required Fields:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Name or Item Name</li>
                  <li>• SKU</li>
                  <li>• Category</li>
                  <li>• Current Stock</li>
                  <li>• Min Stock</li>
                  <li>• Max Stock</li>
                  <li>• Price</li>
                  <li>• Supplier</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Notification</DialogTitle>
              <DialogDescription>Notify relevant personnel about inventory issues</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  value={notificationForm.recipients}
                  onChange={(e) => setNotificationForm({ ...notificationForm, recipients: e.target.value })}
                  placeholder="Enter email addresses or phone numbers"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={notificationForm.subject}
                  onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })}
                  placeholder="Enter notification subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="method">Notification Method</Label>
                <Select
                  value={notificationForm.method}
                  onValueChange={(value: "email" | "sms" | "both") =>
                    setNotificationForm({ ...notificationForm, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <Mail className="h-4 w-4 mr-2 inline" />
                      Email Only
                    </SelectItem>
                    <SelectItem value="sms">
                      <Phone className="h-4 w-4 mr-2 inline" />
                      SMS Only
                    </SelectItem>
                    <SelectItem value="both">
                      <Bell className="h-4 w-4 mr-2 inline" />
                      Email & SMS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendNotification}>
                <Bell className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <VoiceAssistant
  onCommand={(command) => {
    // custom logic to respond to voice input
    console.log("User said:", command)
    // you can trigger search, reorder, filter etc here
  }}
/>


    </PageTransition>
  )
}