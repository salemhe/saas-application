'use client'

import React from 'react'
import { useCampaignForm } from '@/context/CampaignFormContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function GoogleSteps({ step }: { step: number }) {
  const { formData, updateFormData } = useCampaignForm()

  const updateGoogleData = (data: Partial<NonNullable<typeof formData.google>>) => {
    updateFormData({ google: { ...formData.google, ...data } })
  }

  switch (step) {
    case 1:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="keywords">Keywords*</Label>
            <Textarea
              id="keywords"
              value={formData.google?.keywords?.join(', ') || ''}
              onChange={(e) => updateGoogleData({ keywords: e.target.value.split(',').map(k => k.trim()) })}
              placeholder="Enter keywords (comma-separated)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adType">Ad Type*</Label>
            <Select
              value={formData.google?.adType || ''}
              onValueChange={(value) => updateGoogleData({ adType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ad type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Ad</SelectItem>
                <SelectItem value="responsive_search">Responsive Search Ad</SelectItem>
                <SelectItem value="display">Display Ad</SelectItem>
                <SelectItem value="video">Video Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline*</Label>
            <Input
              id="headline"
              value={formData.google?.headline || ''}
              onChange={(e) => updateGoogleData({ headline: e.target.value })}
              placeholder="Enter headline"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              value={formData.google?.description || ''}
              onChange={(e) => updateGoogleData({ description: e.target.value })}
              placeholder="Enter ad description"
              required
            />
          </div>
        </div>
      )
    case 3:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="finalUrl">Final URL*</Label>
            <Input
              id="finalUrl"
              value={formData.google?.finalUrl || ''}
              onChange={(e) => updateGoogleData({ finalUrl: e.target.value })}
              placeholder="Enter final URL"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayUrl">Display URL*</Label>
            <Input
              id="displayUrl"
              value={formData.google?.displayUrl || ''}
              onChange={(e) => updateGoogleData({ displayUrl: e.target.value })}
              placeholder="Enter display URL"
              required
            />
          </div>
        </div>
      )
    case 4:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="callToAction">Call to Action*</Label>
            <Select
              value={formData.google?.callToAction || ''}
              onValueChange={(value) => updateGoogleData({ callToAction: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select call to action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learn_more">Learn More</SelectItem>
                <SelectItem value="sign_up">Sign Up</SelectItem>
                <SelectItem value="buy_now">Buy Now</SelectItem>
                <SelectItem value="get_quote">Get Quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL*</Label>
            <Input
              id="imageUrl"
              value={formData.google?.imageUrl || ''}
              onChange={(e) => updateGoogleData({ imageUrl: e.target.value })}
              placeholder="Enter image URL"
              required
            />
          </div>
        </div>
      )
    default:
      return null
  }
}

