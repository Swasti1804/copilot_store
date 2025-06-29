"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface RegionSentiment {
  region: string
  city: string
  coordinates: [number, number]
  positive: number
  neutral: number
  negative: number
  totalMentions: number
  score: number
  trend: "up" | "down" | "stable"
  topKeywords: string[]
}

const mockRegionData: RegionSentiment[] = [
  {
    region: "North India",
    city: "Delhi",
    coordinates: [28.6139, 77.209],
    positive: 45,
    neutral: 25,
    negative: 30,
    totalMentions: 100,
    score: 58,
    trend: "down",
    topKeywords: ["late", "delivery", "service"],
  },
  {
    region: "West India",
    city: "Mumbai",
    coordinates: [19.076, 72.8777],
    positive: 65,
    neutral: 20,
    negative: 15,
    totalMentions: 120,
    score: 75,
    trend: "up",
    topKeywords: ["fast", "quality", "delicious"],
  },
  {
    region: "South India",
    city: "Bangalore",
    coordinates: [12.9716, 77.5946],
    positive: 70,
    neutral: 18,
    negative: 12,
    totalMentions: 95,
    score: 79,
    trend: "up",
    topKeywords: ["burger", "new", "amazing"],
  },
  {
    region: "West India",
    city: "Pune",
    coordinates: [18.5204, 73.8567],
    positive: 55,
    neutral: 25,
    negative: 20,
    totalMentions: 80,
    score: 68,
    trend: "stable",
    topKeywords: ["average", "okay", "decent"],
  },
]

export function SentimentMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionSentiment | null>(null)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Placeholder */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Heatmap by Region</CardTitle>
            <CardDescription>Geographic distribution of customer sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Interactive Map View</p>
                <p className="text-sm text-gray-500 mt-2">Click on regions below to view detailed sentiment data</p>
              </div>

              {/* Region Markers */}
              <div className="absolute inset-0">
                {mockRegionData.map((region, index) => (
                  <button
                    key={region.city}
                    onClick={() => setSelectedRegion(region)}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                      region.score >= 70 ? "bg-green-500" : region.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + index * 15}%`,
                    }}
                    title={`${region.city} - ${region.score}% sentiment`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Regional Analysis</CardTitle>
            <CardDescription>Click on map markers for details</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRegion ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRegion.city}</h3>
                  <p className="text-sm text-gray-600">{selectedRegion.region}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sentiment Score</span>
                    <span className={`font-bold ${getScoreColor(selectedRegion.score)}`}>{selectedRegion.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Mentions</span>
                    <span className="font-medium">{selectedRegion.totalMentions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(selectedRegion.trend)}
                      <span className="capitalize">{selectedRegion.trend}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Sentiment Breakdown</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Positive</span>
                      <span>{selectedRegion.positive}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-600">Neutral</span>
                      <span>{selectedRegion.neutral}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Negative</span>
                      <span>{selectedRegion.negative}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Top Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRegion.topKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Select a region on the map to view detailed analysis</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Region List */}
        <Card>
          <CardHeader>
            <CardTitle>All Regions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockRegionData.map((region) => (
              <button
                key={region.city}
                onClick={() => setSelectedRegion(region)}
                className={`w-full p-3 text-left rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedRegion?.city === region.city ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{region.city}</div>
                    <div className="text-sm text-gray-600">{region.totalMentions} mentions</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getScoreColor(region.score)}`}>{region.score}%</div>
                    {getTrendIcon(region.trend)}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
