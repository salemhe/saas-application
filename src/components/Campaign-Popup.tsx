'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'

export function CampaignPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const doNotShow = localStorage.getItem('doNotShowFacebookCampaignPopup')
    if (doNotShow === 'true') {
      setDoNotShowAgain(true)
    }
  }, [])

  const campaignPreparationSteps = [
    "Define your campaign objective (e.g., brand awareness, lead generation, conversions)",
    "Identify your target audience",
    "Set a budget for your campaign",
    "Prepare high-quality images or videos for your ads",
    "Write compelling ad copy",
    "Create a landing page for your campaign (if necessary)",
    "Set up Facebook Pixel on your website for tracking",
    "Review Facebook's advertising policies",
    "Determine the duration of your campaign",
    "Decide on your bidding strategy"
  ]

  const handleButtonClick = () => {
    if (doNotShowAgain) {
      router.push('/campaign/create')
    } else {
      setIsOpen(true)
    }
  }

  const handleContinue = () => {
    if (doNotShowAgain) {
      localStorage.setItem('doNotShowFacebookCampaignPopup', 'true')
    }
    setIsOpen(false)
    router.push('/campaign/create')
  }

  return (
    <>
      <Button onClick={handleButtonClick}><Plus className="w-4 h-4 mr-2" size={24} /> Create Campaign</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Prepare for Your Facebook Campaign</DialogTitle>
            <DialogDescription>
              Before creating your Facebook campaign, make sure you&apos;ve completed these steps:
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <ol className="list-decimal pl-5 space-y-2">
              {campaignPreparationSteps.map((step, index) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Checkbox 
              id="doNotShowAgain" 
              checked={doNotShowAgain} 
              onCheckedChange={(checked) => setDoNotShowAgain(checked as boolean)}
            />
            <label 
              htmlFor="doNotShowAgain" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not show this again
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleContinue}>Continue to Campaign Creation</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

