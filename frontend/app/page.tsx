import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ArrowRightLeft,
  CloudRain,
  Shield,
  TrendingUp,
  MessageSquare,
  Store,
  CheckCircle,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Play,
  Star,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Live Inventory Tracker",
    description: "Real-time inventory monitoring across all franchise locations with predictive analytics",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
  },
  {
    icon: ArrowRightLeft,
    title: "Inter-store Stock Suggestions",
    description: "AI-powered recommendations for optimal stock transfers and demand forecasting",
    color: "bg-green-500",
    lightColor: "bg-green-50",
  },
  {
    icon: CloudRain,
    title: "Weather-Based Delivery Alerts",
    description: "Smart delivery scheduling based on weather conditions and traffic patterns",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Driver Risk Monitor",
    description: "Real-time safety scoring and risk assessment with automated alerts",
    color: "bg-red-500",
    lightColor: "bg-red-50",
  },
  {
    icon: TrendingUp,
    title: "Public Sentiment Analysis",
    description: "Monitor brand sentiment across social media and news with actionable insights",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
  },
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Intelligent assistant for operational queries with natural language processing",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
  },
]

const stats = [
  { label: "Franchise Locations", value: "500+", icon: Store },
  { label: "Daily Transactions", value: "50K+", icon: BarChart3 },
  { label: "Active Users", value: "2K+", icon: Users },
  { label: "Uptime", value: "99.9%", icon: Zap },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Franchise Owner",
    company: "QuickBite Restaurants",
    content:
      "SmartStore Copilot transformed our operations. We reduced inventory waste by 30% and improved delivery efficiency significantly.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Operations Manager",
    company: "FreshMart Chain",
    content:
      "The AI insights are incredible. We can predict demand patterns and optimize our supply chain like never before.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm opacity-30"></div>
                <Store className="relative h-10 w-10 text-blue-600 bg-blue-50 p-2 rounded-xl" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SmartStore
                </span>
                <div className="text-xs text-gray-500 font-medium">COPILOT</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Reviews
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Pricing
                </a>
              </nav>
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:hidden">
              <Link href="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Operations
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Real-time Franchise
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Operations Copilot
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your franchise operations with AI-powered insights, real-time monitoring, and intelligent
              automation that drives growth and efficiency across all locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 border-2 hover:bg-gray-50 group bg-transparent"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200">Features</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                optimize operations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and insights to streamline your franchise operations and drive sustainable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-white"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-14 h-14 ${feature.lightColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`h-7 w-7 text-white ${feature.color} p-1.5 rounded-lg`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Testimonials</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by franchise
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                owners worldwide
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">
                        {testimonial.role}, {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your operations?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of franchise owners who trust SmartStore Copilot to optimize their operations and drive
            growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="flex items-center text-blue-100">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm opacity-30"></div>
                  <Store className="relative h-8 w-8 text-blue-400 bg-blue-900 p-1.5 rounded-xl" />
                </div>
                <div>
                  <span className="text-xl font-bold">SmartStore</span>
                  <div className="text-xs text-gray-400 font-medium">COPILOT</div>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Empowering franchise operations with AI-driven insights and real-time monitoring for sustainable growth.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartStore Copilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
