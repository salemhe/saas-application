"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

// Mocked data in a format similar to Facebook Graph API response
const apiData = {
  data: [
    {
      date_start: "2023-05-01",
      date_stop: "2023-05-31",
      account_id: "123456789",
      account_name: "My Ad Account",
      campaign_id: "987654321",
      campaign_name: "Summer Sale Campaign",
      impressions: "1000000",
      clicks: "50000",
      spend: "5000.00",
      actions: [
        { action_type: "link_click", value: "40000" },
        { action_type: "post_engagement", value: "75000" },
        { action_type: "purchase", value: "1000" }
      ]
    },
    // ... more data points
  ],
  paging: {
    cursors: {
      before: "MAZDZD",
      after: "MjQZD"
    },
    next: "https://graph.facebook.com/v13.0/act_123456789/insights?access_token=..."
  }
}

// Process the data for the chart
const chartData = [
  { name: 'May 1', impressions: 800000, clicks: 40000, spend: 4000, purchases: 800 },
  { name: 'May 8', impressions: 900000, clicks: 45000, spend: 4500, purchases: 900 },
  { name: 'May 15', impressions: 950000, clicks: 47500, spend: 4750, purchases: 950 },
  { name: 'May 22', impressions: 1000000, clicks: 50000, spend: 5000, purchases: 1000 },
  { name: 'May 29', impressions: 1100000, clicks: 55000, spend: 5500, purchases: 1100 },
]

export function SocialMediaMetrics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseInt(apiData.data[0].impressions).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {apiData.data[0].date_start} to {apiData.data[0].date_stop}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseInt(apiData.data[0].clicks).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {apiData.data[0].date_start} to {apiData.data[0].date_stop}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${parseFloat(apiData.data[0].spend).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">
              {apiData.data[0].date_start} to {apiData.data[0].date_stop}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parseInt(apiData.data[0].actions.find(action => action.action_type === "purchase")?.value || "0").toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {apiData.data[0].date_start} to {apiData.data[0].date_stop}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>An overview of your campaign metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="impressions" className="space-y-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="impressions">Impressions</TabsTrigger>
              <TabsTrigger value="clicks">Clicks</TabsTrigger>
              <TabsTrigger value="spend">Spend</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>
            <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
              <TabsContent value="impressions" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="clicks" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="spend" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="spend" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="purchases" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="purchases" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

