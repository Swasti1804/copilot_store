import { Suspense } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CloudRain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { PushNotificationManager } from "@/components/push-notification-manager"
import { WeatherWidget } from "@/components/weather/weather-widget"
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container"
import { AnimatedCard } from "@/components/motion/animated-card"
import { PageTransition } from "@/components/motion/page-transition"
import { DashboardSkeleton } from "@/components/loading-skeleton"

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your franchise operations</p>
        </div>

        {/* Stats Cards */}
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <AnimatedCard className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">12,847</div>
                <p className="text-xs text-blue-600">+2.1% from last month</p>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Truck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">24</div>
                <p className="text-xs text-green-600">3 high-risk alerts</p>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weather Alerts</CardTitle>
                <CloudRain className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">2</div>
                <p className="text-xs text-yellow-600">Delivery delays expected</p>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>

          <StaggerItem>
            <AnimatedCard className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sentiment Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">8.2/10</div>
                <p className="text-xs text-purple-600">+0.3 from yesterday</p>
              </CardContent>
            </AnimatedCard>
          </StaggerItem>
        </StaggerContainer>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Recent Activity - Takes up more space */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatedCard delay={0.4}>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StaggerContainer delay={0.1}>
                  <StaggerItem>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Low stock alert - Store #3</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                      <Badge variant="secondary">Inventory</Badge>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High-risk driver detected</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                      <Badge variant="destructive">Safety</Badge>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-center space-x-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Stock transfer completed</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                      <Badge variant="default">Success</Badge>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard delay={0.5}>
              <CardHeader>
                <CardTitle>Store Performance</CardTitle>
                <CardDescription>Top performing locations today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <StaggerContainer delay={0.1}>
                  <StaggerItem>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                      <div>
                        <p className="text-sm font-medium">Store #1 - Downtown</p>
                        <p className="text-xs text-muted-foreground">Revenue: $12,450</p>
                      </div>
                      <Badge variant="default">🏆 Top</Badge>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">Store #5 - Mall</p>
                        <p className="text-xs text-muted-foreground">Revenue: $9,870</p>
                      </div>
                      <Badge variant="secondary">🥈 2nd</Badge>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">Store #3 - Suburb</p>
                        <p className="text-xs text-muted-foreground">Revenue: $8,320</p>
                      </div>
                      <Badge variant="secondary">🥉 3rd</Badge>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </CardContent>
            </AnimatedCard>
          </div>

          {/* Sidebar Content - More compact */}
          <div className="lg:col-span-4 space-y-6">
            <Suspense fallback={<DashboardSkeleton />}>
              <WeatherWidget />
            </Suspense>

            <AnimatedCard delay={0.6}>
              <PushNotificationManager />
            </AnimatedCard>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
