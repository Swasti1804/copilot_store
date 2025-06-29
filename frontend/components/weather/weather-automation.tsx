"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Thermometer,
  AlertTriangle,
  Plus,
  Settings,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Bell,
  Users,
  Calendar,
  Package,
  FileText,
} from "lucide-react"

interface WeatherAutomation {
  id: string
  name: string
  enabled: boolean
  location: string
  trigger: {
    condition: string
    operator: string
    value: number
    duration: number
  }
  actions: {
    type: string
    parameters: Record<string, any>
  }[]
  triggerCount: number
  lastTriggered?: string
  status: "active" | "inactive" | "error"
}

interface AutomationLog {
  id: string
  automationId: string
  automationName: string
  timestamp: string
  trigger: string
  actions: string[]
  status: "success" | "partial" | "failed"
  details: string
}

const mockAutomations: WeatherAutomation[] = [
  {
    id: "1",
    name: "Extreme Heat Protocol",
    enabled: true,
    location: "Downtown Store",
    trigger: {
      condition: "temperature",
      operator: "greater_than",
      value: 95,
      duration: 30,
    },
    actions: [
      { type: "send_notification", parameters: { message: "Extreme heat detected", urgency: "high" } },
      { type: "adjust_schedule", parameters: { action: "reduce_outdoor_activities" } },
    ],
    triggerCount: 12,
    lastTriggered: "2024-01-15T14:30:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "High Wind Advisory",
    enabled: true,
    location: "Mall Location",
    trigger: {
      condition: "wind_speed",
      operator: "greater_than",
      value: 20,
      duration: 15,
    },
    actions: [
      { type: "alert_suppliers", parameters: { message: "Delivery delays possible due to high winds" } },
      { type: "send_notification", parameters: { message: "High wind conditions detected", urgency: "medium" } },
    ],
    triggerCount: 8,
    lastTriggered: "2024-01-14T09:15:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Heavy Rain Response",
    enabled: false,
    location: "Suburban Store",
    trigger: {
      condition: "precipitation",
      operator: "greater_than",
      value: 0.5,
      duration: 60,
    },
    actions: [
      { type: "adjust_schedule", parameters: { action: "delay_deliveries" } },
      { type: "update_inventory", parameters: { action: "increase_umbrella_stock" } },
    ],
    triggerCount: 3,
    status: "inactive",
  },
]

const mockLogs: AutomationLog[] = [
  {
    id: "1",
    automationId: "1",
    automationName: "Extreme Heat Protocol",
    timestamp: "2024-01-15T14:30:00Z",
    trigger: "Temperature exceeded 95°F for 30+ minutes",
    actions: ["Sent high-priority notification", "Adjusted outdoor activity schedule"],
    status: "success",
    details: "All actions executed successfully. 5 staff members notified.",
  },
  {
    id: "2",
    automationId: "2",
    automationName: "High Wind Advisory",
    timestamp: "2024-01-14T09:15:00Z",
    trigger: "Wind speed exceeded 20 mph for 15+ minutes",
    actions: ["Alerted suppliers about potential delays", "Sent medium-priority notification"],
    status: "success",
    details: "Suppliers acknowledged delivery adjustments. Operations team notified.",
  },
  {
    id: "3",
    automationId: "1",
    automationName: "Extreme Heat Protocol",
    timestamp: "2024-01-13T16:45:00Z",
    trigger: "Temperature exceeded 95°F for 30+ minutes",
    actions: ["Sent high-priority notification", "Adjusted outdoor activity schedule"],
    status: "partial",
    details: "Notification sent successfully, but schedule adjustment failed due to system error.",
  },
]

export function WeatherAutomation() {
  const [automations, setAutomations] = useState<WeatherAutomation[]>(mockAutomations)
  const [logs, setLogs] = useState<AutomationLog[]>(mockLogs)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    location: "",
    condition: "",
    operator: "",
    value: "",
    duration: "",
    actions: [],
  })

  // Simulate real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate checking weather conditions and triggering automations
      const activeAutomations = automations.filter((a) => a.enabled)

      // Randomly trigger an automation (for demo purposes)
      if (Math.random() < 0.1 && activeAutomations.length > 0) {
        const randomAutomation = activeAutomations[Math.floor(Math.random() * activeAutomations.length)]

        const newLog: AutomationLog = {
          id: Date.now().toString(),
          automationId: randomAutomation.id,
          automationName: randomAutomation.name,
          timestamp: new Date().toISOString(),
          trigger: `${randomAutomation.trigger.condition} ${randomAutomation.trigger.operator} ${randomAutomation.trigger.value}`,
          actions: randomAutomation.actions.map((a) => a.type.replace("_", " ")),
          status: Math.random() > 0.8 ? "partial" : "success",
          details: "Automation executed successfully",
        }

        setLogs((prev) => [newLog, ...prev.slice(0, 9)])

        // Update trigger count
        setAutomations((prev) =>
          prev.map((a) =>
            a.id === randomAutomation.id
              ? { ...a, triggerCount: a.triggerCount + 1, lastTriggered: new Date().toISOString() }
              : a,
          ),
        )
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [automations])

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((automation) =>
        automation.id === id
          ? { ...automation, enabled: !automation.enabled, status: !automation.enabled ? "active" : "inactive" }
          : automation,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "partial":
        return "text-yellow-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "partial":
        return <AlertTriangle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const activeAutomations = automations.filter((a) => a.enabled).length
  const totalTriggers = automations.reduce((sum, a) => sum + a.triggerCount, 0)
  const todayTriggers = logs.filter((log) => {
    const today = new Date().toDateString()
    const logDate = new Date(log.timestamp).toDateString()
    return today === logDate
  }).length

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Automations</p>
                <p className="text-2xl font-bold">{activeAutomations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Triggers</p>
                <p className="text-2xl font-bold">{todayTriggers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Current Temp</p>
                <p className="text-2xl font-bold">78°F</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="automations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Weather Automations</h3>
              <p className="text-sm text-gray-600">Automatically trigger actions based on weather conditions</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Automation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Weather Automation</DialogTitle>
                  <DialogDescription>
                    Set up automated actions that trigger based on weather conditions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Automation Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Snow Day Protocol"
                        value={newAutomation.name}
                        onChange={(e) => setNewAutomation((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select
                        value={newAutomation.location}
                        onValueChange={(value) => setNewAutomation((prev) => ({ ...prev, location: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="downtown">Downtown Store</SelectItem>
                          <SelectItem value="mall">Mall Location</SelectItem>
                          <SelectItem value="suburban">Suburban Store</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Trigger Condition</Label>
                    <div className="grid grid-cols-4 gap-2">
                      <Select
                        value={newAutomation.condition}
                        onValueChange={(value) => setNewAutomation((prev) => ({ ...prev, condition: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temperature">Temperature</SelectItem>
                          <SelectItem value="humidity">Humidity</SelectItem>
                          <SelectItem value="wind_speed">Wind Speed</SelectItem>
                          <SelectItem value="precipitation">Precipitation</SelectItem>
                          <SelectItem value="uv_index">UV Index</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={newAutomation.operator}
                        onValueChange={(value) => setNewAutomation((prev) => ({ ...prev, operator: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="greater_than">Greater than</SelectItem>
                          <SelectItem value="less_than">Less than</SelectItem>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Value"
                        value={newAutomation.value}
                        onChange={(e) => setNewAutomation((prev) => ({ ...prev, value: e.target.value }))}
                      />
                      <Input
                        placeholder="Duration (min)"
                        value={newAutomation.duration}
                        onChange={(e) => setNewAutomation((prev) => ({ ...prev, duration: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Actions</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">Send Notification</span>
                        <Switch />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Alert Suppliers</span>
                        <Switch />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Adjust Schedule</span>
                        <Switch />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span className="text-sm">Update Inventory</span>
                        <Switch />
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Log Event</span>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Create Automation</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {automations.map((automation) => (
              <Card key={automation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch checked={automation.enabled} onCheckedChange={() => toggleAutomation(automation.id)} />
                        <div>
                          <h4 className="font-semibold">{automation.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {automation.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Triggered {automation.triggerCount} times</p>
                        {automation.lastTriggered && (
                          <p className="text-xs text-gray-500">
                            Last: {new Date(automation.lastTriggered).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={automation.enabled ? "default" : "secondary"}>{automation.status}</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Trigger:</span>
                        <span>
                          {automation.trigger.condition} {automation.trigger.operator.replace("_", " ")}{" "}
                          {automation.trigger.value}
                          {automation.trigger.condition === "temperature" && "°F"}
                          {automation.trigger.condition === "wind_speed" && " mph"}
                          {automation.trigger.condition === "precipitation" && " in"}
                          {automation.trigger.condition === "humidity" && "%"}
                        </span>
                        <span className="text-gray-500">for {automation.trigger.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Actions:</span>
                        <span>{automation.actions.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Activity Logs</h3>
            <p className="text-sm text-gray-600">Recent automation executions and their results</p>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`mt-1 ${getStatusColor(log.status)}`}>{getStatusIcon(log.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{log.automationName}</h4>
                            <Badge
                              variant={
                                log.status === "success"
                                  ? "default"
                                  : log.status === "partial"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{log.trigger}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Actions executed:</p>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                              {log.actions.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Automation Settings</h3>
            <p className="text-sm text-gray-600">Configure global automation preferences</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Frequency</CardTitle>
                <CardDescription>How often to check weather conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <Select defaultValue="1">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every minute</SelectItem>
                    <SelectItem value="5">Every 5 minutes</SelectItem>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how notifications are sent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send automation alerts via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Send urgent alerts via SMS</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>How long to keep automation logs</CardDescription>
              </CardHeader>
              <CardContent>
                <Select defaultValue="90">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
