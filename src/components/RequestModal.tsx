"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerRequestForm } from "@/components/CustomerRequestForm"

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [activeTab, setActiveTab] = useState("facebook")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Ad Request</DialogTitle>
          <DialogDescription>
            Fill out the form to submit a new advertisement request.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="billboard">Billboard</TabsTrigger>
            <TabsTrigger value="radio">Radio</TabsTrigger>
          </TabsList>
          <TabsContent value="facebook">
            <CustomerRequestForm type="facebook" onSubmit={onClose} />
          </TabsContent>
          <TabsContent value="instagram">
            <CustomerRequestForm type="instagram" onSubmit={onClose} />
          </TabsContent>
          <TabsContent value="billboard">
            <CustomerRequestForm type="billboard" onSubmit={onClose} />
          </TabsContent>
          <TabsContent value="radio">
            <CustomerRequestForm type="radio" onSubmit={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

