"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialMediaMetrics } from "@/components/SocialMediaMetrics"
import { WebsiteAds } from "@/components/WebsiteAds"
import { RequestList } from "@/components/RequestList"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { RequestModal } from "@/components/RequestModal"

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mx-auto px-4 py-8 space-y-8 max-w-[360px] md:max-w-full w-full p-4 md:p-16 sm:p-4 sm:mt-10 mt-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="metrics">Social Media Metrics</TabsTrigger>
          <TabsTrigger value="website-ads">All Ads</TabsTrigger>
          <TabsTrigger value="requests">Customer Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="metrics" className="space-y-4">
          <SocialMediaMetrics />
        </TabsContent>
        <TabsContent value="website-ads" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">All Advertisements</h2>
          </div>
          <WebsiteAds />
        </TabsContent>
        <TabsContent value="requests" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <h2 className="text-2xl font-semibold">Customer Requests</h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Request
            </Button>
          </div>
          <RequestList />
        </TabsContent>
      </Tabs>
      <RequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

