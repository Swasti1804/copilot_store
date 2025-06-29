"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/navigation/page-header"
import { PageTransition } from "@/components/motion/page-transition"
import { StaggerContainer } from "@/components/motion/stagger-container"
import { AnimatedCard } from "@/components/motion/animated-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Download,
  FileText,
  MessageCircle,
  Twitter,
  Globe,
  MapPin,
  Hash,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Zap,
  Clock,
  Star,
  Users,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"

interface SentimentMention {
  id: string
  source: "twitter" | "news" | "review"
  content: string
  sentiment: "positive" | "neutral" | "negative"
  score: number
  timestamp: string
  location?: string
  hashtags: string[]
  storeId?: string
  storeName?: string
  author: string
  platform: string
}

interface StoreSentiment {
  storeId: string
  storeName: string
  location: string
  positive: number
  neutral: number
  negative: number
  totalMentions: number
  score: number
  trend: "up" | "down" | "stable"
}

interface TrendingKeyword {
  keyword: string
  mentions: number
  sentiment: "positive" | "neutral" | "negative"
  change: number
}

interface SentimentAlert {
  id: string
  type: "spike" | "drop" | "keyword" | "store"
  severity: "high" | "medium" | "low"
  title: string
  description: string
  timestamp: string
  storeId?: string
  keyword?: string
}

const mockMentions: SentimentMention[] = [
  {
    id: "1",
    source: "twitter",
    content: "Amazing delivery service from @SmartStore! Got my groceries in 30 minutes. #fastdelivery #satisfied",
    sentiment: "positive",
    score: 92,
    timestamp: "2024-01-15T14:30:00Z",
    location: "Delhi",
    hashtags: ["fastdelivery", "satisfied"],
    storeId: "ST001",
    storeName: "SmartStore Delhi Central",
    author: "@foodie_delhi",
    platform: "Twitter",
  },
  {
    id: "2",
    source: "news",
    content: "SmartStore expands delivery network with new burger launch receiving positive customer feedback",
    sentiment: "positive",
    score: 88,
    timestamp: "2024-01-15T13:45:00Z",
    location: "Mumbai",
    hashtags: ["expansion", "newlaunch"],
    storeId: "ST002",
    storeName: "SmartStore Mumbai West",
    author: "Food Business News",
    platform: "News Portal",
  },
  {
    id: "3",
    source: "review",
    content: "Terrible experience! Order was 2 hours late and food was cold. Very disappointed with SmartStore Pune.",
    sentiment: "negative",
    score: 15,
    timestamp: "2024-01-15T12:20:00Z",
    location: "Pune",
    hashtags: ["latedelivery", "disappointed"],
    storeId: "ST003",
    storeName: "SmartStore Pune East",
    author: "Rajesh K.",
    platform: "Google Reviews",
  },
  {
    id: "4",
    source: "twitter",
    content: "SmartStore delivery was okay, nothing special but got the job done. Average experience.",
    sentiment: "neutral",
    score: 55,
    timestamp: "2024-01-15T11:15:00Z",
    location: "Bangalore",
    hashtags: ["average", "okay"],
    storeId: "ST004",
    storeName: "SmartStore Bangalore South",
    author: "@tech_guy_blr",
    platform: "Twitter",
  },
  {
    id: "5",
    source: "review",
    content: "Love the new burger! SmartStore has really improved their menu. Quick delivery too! #newburger",
    sentiment: "positive",
    score: 95,
    timestamp: "2024-01-15T10:30:00Z",
    location: "Delhi",
    hashtags: ["newburger", "improved"],
    storeId: "ST001",
    storeName: "SmartStore Delhi Central",
    author: "Priya S.",
    platform: "Zomato",
  },
  {
    id: "6",
    source: "twitter",
    content: "Another late delivery from SmartStore. This is becoming a pattern. Need to improve! #latedelivery",
    sentiment: "negative",
    score: 25,
    timestamp: "2024-01-15T09:45:00Z",
    location: "Pune",
    hashtags: ["latedelivery", "improve"],
    storeId: "ST003",
    storeName: "SmartStore Pune East",
    author: "@pune_foodie",
    platform: "Twitter",
  },
]

const mockStores: StoreSentiment[] = [
  {
    storeId: "ST001",
    storeName: "SmartStore Delhi Central",
    location: "Delhi",
    positive: 45,
    neutral: 20,
    negative: 8,
    totalMentions: 73,
    score: 78,
    trend: "up",
  },
  {
    storeId: "ST002",
    storeName: "SmartStore Mumbai West",
    location: "Mumbai",
    positive: 38,
    neutral: 15,
    negative: 5,
    totalMentions: 58,
    score: 82,
    trend: "up",
  },
  {
    storeId: "ST003",
    storeName: "SmartStore Pune East",
    location: "Pune",
    positive: 12,
    neutral: 18,
    negative: 25,
    totalMentions: 55,
    score: 42,
    trend: "down",
  },
  {
    storeId: "ST004",
    storeName: "SmartStore Bangalore South",
    location: "Bangalore",
    positive: 28,
    neutral: 22,
    negative: 12,
    totalMentions: 62,
    score: 65,
    trend: "stable",
  },
]

const mockTrendingKeywords: TrendingKeyword[] = [
  { keyword: "late delivery", mentions: 45, sentiment: "negative", change: 120 },
  { keyword: "new burger", mentions: 38, sentiment: "positive", change: 85 },
  { keyword: "fast service", mentions: 32, sentiment: "positive", change: 15 },
  { keyword: "cold food", mentions: 28, sentiment: "negative", change: 67 },
  { keyword: "great taste", mentions: 25, sentiment: "positive", change: 22 },
  { keyword: "poor quality", mentions: 18, sentiment: "negative", change: 45 },
]

const mockAlerts: SentimentAlert[] = [
  {
    id: "A001",
    type: "spike",
    severity: "high",
    title: "Negative Sentiment Spike",
    description: "🔴 Negative tweets increased 120% in the last 3 hours",
    timestamp: "2024-01-15T15:30:00Z",
    keyword: "late delivery",
  },
  {
    id: "A002",
    type: "store",
    severity: "high",
    title: "Store Performance Alert",
    description: "SmartStore Pune East showing critically low sentiment score (42%)",
    timestamp: "2024-01-15T14:45:00Z",
    storeId: "ST003",
  },
  {
    id: "A003",
    type: "keyword",
    severity: "medium",
    title: "Trending Negative Keyword",
    description: "Cold food complaints increased by 67% this week",
    timestamp: "2024-01-15T13:20:00Z",
    keyword: "cold food",
  },
]

const sentimentTimelineData = [
  { time: "00:00", positive: 25, neutral: 15, negative: 8 },
  { time: "04:00", positive: 18, neutral: 12, negative: 5 },
  { time: "08:00", positive: 42, neutral: 25, negative: 12 },
  { time: "12:00", positive: 65, neutral: 35, negative: 28 },
  { time: "16:00", positive: 58, neutral: 30, negative: 22 },
  { time: "20:00", positive: 48, neutral: 28, negative: 15 },
]

const sentimentDistributionData = [
  { name: "Positive", value: 52, color: "#10b981" },
  { name: "Neutral", value: 30, color: "#6b7280" },
  { name: "Negative", value: 18, color: "#ef4444" },
]

export default function SentimentPage() {
  const [mentions, setMentions] = useState<SentimentMention[]>(mockMentions)
  const [stores, setStores] = useState<StoreSentiment[]>(mockStores)
  const [alerts, setAlerts] = useState<SentimentAlert[]>(mockAlerts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sentimentFilter, setSentimentFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("24h")
  const [selectedStore, setSelectedStore] = useState<string>("all")
  const { toast } = useToast()

  const filteredMentions = useMemo(() => {
    return mentions.filter((mention) => {
      const matchesSearch =
        mention.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mention.hashtags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        mention.storeName?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSentiment = sentimentFilter === "all" || mention.sentiment === sentimentFilter
      const matchesSource = sourceFilter === "all" || mention.source === sourceFilter
      const matchesStore = selectedStore === "all" || mention.storeId === selectedStore

      return matchesSearch && matchesSentiment && matchesSource && matchesStore
    })
  }, [mentions, searchTerm, sentimentFilter, sourceFilter, selectedStore])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "neutral":
        return "😐"
      case "negative":
        return "😡"
      default:
        return "😐"
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      case "neutral":
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
      case "negative":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300"
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "news":
        return <Globe className="h-4 w-4" />
      case "review":
        return <Star className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
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

  const handleExportCSV = () => {
    const csvData = filteredMentions.map((mention) => ({
      Source: mention.source,
      Content: mention.content,
      Sentiment: mention.sentiment,
      Score: mention.score,
      Timestamp: mention.timestamp,
      Location: mention.location || "",
      Store: mention.storeName || "",
      Author: mention.author,
      Hashtags: mention.hashtags.join(", "),
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sentiment-analysis-report.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Sentiment analysis report has been exported as CSV.",
    })
  }

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF report generation started. Download will begin shortly.",
    })
  }

  const totalMentions = mentions.length
  const positiveMentions = mentions.filter((m) => m.sentiment === "positive").length
  const neutralMentions = mentions.filter((m) => m.sentiment === "neutral").length
  const negativeMentions = mentions.filter((m) => m.sentiment === "negative").length
  const averageScore = Math.round(mentions.reduce((sum, m) => sum + m.score, 0) / mentions.length)

  return (
    <PageTransition>
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title="Live Sentiment Analysis"
          description="Real-time customer sentiment monitoring across social media, news, and reviews"
        />

        {/* Live Sentiment Dashboard */}
        <StaggerContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <AnimatedCard index={0}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scanned Today</p>
                      <p className="text-2xl font-bold text-blue-600">{totalMentions}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">😊 Positive</p>
                      <p className="text-2xl font-bold text-green-600">{positiveMentions}</p>
                    </div>
                    <ThumbsUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={2}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">😐 Neutral</p>
                      <p className="text-2xl font-bold text-gray-600">{neutralMentions}</p>
                    </div>
                    <Minus className="h-8 w-8 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={3}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">😡 Negative</p>
                      <p className="text-2xl font-bold text-red-600">{negativeMentions}</p>
                    </div>
                    <ThumbsDown className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            <AnimatedCard index={4}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
                      <p className="text-2xl font-bold text-purple-600">{averageScore}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </StaggerContainer>

        {/* Sentiment Distribution Chart */}
        <AnimatedCard delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Sentiment Distribution
              </CardTitle>
              <CardDescription>Real-time breakdown of customer sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sentimentDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {sentimentDistributionData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm font-medium">
                      {entry.name}: {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="feed">Live Feed</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="stores">Store Analysis</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="map">Regional Map</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search mentions, hashtags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sentiments</SelectItem>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="review">Reviews</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger>
                      <SelectValue placeholder="Store" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {stores.map((store) => (
                        <SelectItem key={store.storeId} value={store.storeId}>
                          {store.storeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
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

            {/* Recent Mentions Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recent Mentions Feed
                </CardTitle>
                <CardDescription>Showing {filteredMentions.length} mentions from the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMentions.map((mention, index) => (
                    <motion.div
                      key={mention.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(mention.source)}
                          <span className="text-2xl">{getSentimentIcon(mention.sentiment)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSentimentColor(mention.sentiment)}>
                              {mention.sentiment} ({mention.score}%)
                            </Badge>
                            <Badge variant="outline">{mention.platform}</Badge>
                            {mention.storeName && <Badge variant="secondary">{mention.storeName}</Badge>}
                          </div>
                          <p className="text-sm mb-2">{mention.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {mention.author}
                            </span>
                            {mention.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {mention.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(mention.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {mention.hashtags.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Hash className="h-3 w-3 text-blue-500" />
                              {mention.hashtags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Trending Keywords & Word Cloud
                </CardTitle>
                <CardDescription>Most mentioned terms and their sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Trending Keywords</h3>
                    {mockTrendingKeywords.map((keyword, index) => (
                      <motion.div
                        key={keyword.keyword}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getSentimentIcon(keyword.sentiment)}</span>
                          <div>
                            <div className="font-medium">{keyword.keyword}</div>
                            <div className="text-sm text-gray-500">{keyword.mentions} mentions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getSentimentColor(keyword.sentiment)}>{keyword.sentiment}</Badge>
                          <div
                            className={`text-sm font-medium ${keyword.change > 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {keyword.change > 0 ? "+" : ""}
                            {keyword.change}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Keyword Analytics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockTrendingKeywords}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="mentions" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Store-wise Sentiment Overview
                </CardTitle>
                <CardDescription>Sentiment breakdown and performance by store location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Store</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Positive</th>
                        <th className="text-left p-2">Neutral</th>
                        <th className="text-left p-2">Negative</th>
                        <th className="text-left p-2">Score (%)</th>
                        <th className="text-left p-2">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store, index) => (
                        <motion.tr
                          key={store.storeId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="p-2">
                            <div className="font-medium">{store.storeName}</div>
                            <div className="text-sm text-gray-500">{store.storeId}</div>
                          </td>
                          <td className="p-2">{store.location}</td>
                          <td className="p-2">
                            <span className="text-green-600 font-medium">{store.positive}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-gray-600 font-medium">{store.neutral}</span>
                          </td>
                          <td className="p-2">
                            <span className="text-red-600 font-medium">{store.negative}</span>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <Progress value={store.score} className="w-16 h-2" />
                              <span
                                className={`font-medium ${store.score >= 70 ? "text-green-600" : store.score >= 50 ? "text-yellow-600" : "text-red-600"}`}
                              >
                                {store.score}%
                              </span>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              {getTrendIcon(store.trend)}
                              <span className="text-sm capitalize">{store.trend}</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Negative Sentiment Alerts
              </h2>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {alerts.length} Active Alerts
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
                            <AlertTriangle className="h-5 w-5" />
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge className={getAlertSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          </div>
                          <p className="text-sm">{alert.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {alert.keyword && (
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {alert.keyword}
                              </span>
                            )}
                            {alert.storeId && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {stores.find((s) => s.storeId === alert.storeId)?.storeName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Investigate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Sentiment Timeline Chart
                </CardTitle>
                <CardDescription>Hourly sentiment volume tracking over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={sentimentTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Positive"
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#6b7280"
                      fill="#6b7280"
                      name="Neutral"
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      name="Negative"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Regional Sentiment Map
                </CardTitle>
                <CardDescription>Geographic distribution of customer sentiment by city/state</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Sentiment Heatmap</h3>
                    <p className="text-gray-500 mb-4">Geographic visualization of customer sentiment by region</p>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Positive Regions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>Neutral Regions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Negative Regions</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock regional data */}
                  <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg">
                    <h4 className="font-semibold mb-2">Regional Breakdown</h4>
                    <div className="space-y-2">
                      {stores.slice(0, 4).map((store) => (
                        <div key={store.storeId} className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              store.score >= 70 ? "bg-green-500" : store.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                          ></div>
                          <span>{store.location}</span>
                          <span className="text-gray-500">({store.score}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Summary & Insights
                </CardTitle>
                <CardDescription>GPT-powered analysis and actionable recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Weekly Summary</h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    "This week, most negative reviews are about late deliveries in Pune, with SmartStore Pune East
                    showing a critically low sentiment score of 42%. Positive sentiment is primarily driven by the new
                    burger launch in Delhi and Mumbai, with customers praising both taste and quick delivery times. The
                    'late delivery' keyword has spiked 120% in negative mentions, requiring immediate attention."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Critical Issues
                      </h4>
                      <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                        <li>• Late delivery complaints increased 120%</li>
                        <li>• Pune East store needs immediate intervention</li>
                        <li>• Cold food complaints rising in evening hours</li>
                        <li>• Customer service response time issues</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Positive Trends
                      </h4>
                      <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                        <li>• New burger launch receiving excellent feedback</li>
                        <li>• Delhi and Mumbai stores performing well</li>
                        <li>• Fast service mentions increased 15%</li>
                        <li>• Overall taste quality improvements noted</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                        <h5 className="font-medium text-yellow-900 dark:text-yellow-100">Immediate Actions</h5>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                          Deploy additional delivery staff to Pune East during peak hours (12-8 PM) to address late
                          delivery issues.
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100">Marketing Opportunities</h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Leverage positive burger launch feedback for social media campaigns in Delhi and Mumbai
                          markets.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <h5 className="font-medium text-green-900 dark:text-green-100">Process Improvements</h5>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Implement temperature monitoring for deliveries to reduce cold food complaints during longer
                          routes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
