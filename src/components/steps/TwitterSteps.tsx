'use client'

import React from 'react'
import { useCampaignForm } from '@/context/CampaignFormContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function TwitterSteps({ step }: { step: number }) {
  const { formData, updateFormData } = useCampaignForm()

  const updateTwitterData = (data: Partial<NonNullable<typeof formData.twitter>>) => {
    updateFormData({ twitter: { ...formData.twitter, ...data } })
  }

  switch (step) {
    case 1:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="objective">Campaign Objective*</Label>
            <Select
              value={formData.twitter?.objective || ''}
              onValueChange={(value) => updateTwitterData({ objective: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="consideration">Consideration</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="adFormat">Ad Format*</Label>
            <Select
              value={formData.twitter?.adFormat || ''}
              onValueChange={(value) => updateTwitterData({ adFormat: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ad format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promoted_tweet">Promoted Tweet</SelectItem>
                <SelectItem value="promoted_account">Promoted Account</SelectItem>
                <SelectItem value="promoted_trend">Promoted Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience*</Label>
            <Input
              id="targetAudience"
              value={formData.twitter?.targetAudience || ''}
              onChange={(e) => updateTwitterData({ targetAudience: e.target.value })}
              placeholder="Enter target audience"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="interests">Interests*</Label>
            <Textarea
              id="interests"
              value={formData.twitter?.interests?.join(', ') || ''}
              onChange={(e) => updateTwitterData({ interests: e.target.value.split(',').map(i => i.trim()) })}
              placeholder="Enter interests (comma-separated)"
              required
            />
          </div>
        </div>
      )
    case 3:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="tweetText">Tweet Text*</Label>
            <Textarea
              id="tweetText"
              value={formData.twitter?.tweetText || ''}
              onChange={(e) => updateTwitterData({ tweetText: e.target.value })}
              placeholder="Enter tweet text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL*</Label>
            <Input
              id="websiteUrl"
              value={formData.twitter?.websiteUrl || ''}
              onChange={(e) => updateTwitterData({ websiteUrl: e.target.value })}
              placeholder="Enter website URL"
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
              value={formData.twitter?.callToAction || ''}
              onValueChange={(value) => updateTwitterData({ callToAction: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select call to action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visit_site">Visit Site</SelectItem>
                <SelectItem value="shop_now">Shop Now</SelectItem>
                <SelectItem value="download">Download</SelectItem>
                <SelectItem value="sign_up">Sign Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL*</Label>
            <Input
              id="imageUrl"
              value={formData.twitter?.imageUrl || ''}
              onChange={(e) => updateTwitterData({ imageUrl: e.target.value })}
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

