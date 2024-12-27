'use client'

import React from 'react'
import { useCampaignForm } from '@/context/CampaignFormContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FacebookSteps({ step }: { step: number }) {
  const { formData, updateFormData } = useCampaignForm()

  const updateFacebookData = (data: Partial<NonNullable<typeof formData.facebook>>) => {
    updateFormData({ facebook: { ...formData.facebook, ...data } })
  }

  switch (step) {
    case 1:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience*</Label>
            <Input
              id="audience"
              value={formData.facebook?.audience || ''}
              onChange={(e) => updateFacebookData({ audience: e.target.value })}
              placeholder="Enter target audience"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="placement">Ad Placement*</Label>
            <Select
              value={formData.facebook?.placement || ''}
              onValueChange={(value) => updateFacebookData({ placement: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ad placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feed">Feed</SelectItem>
                <SelectItem value="stories">Stories</SelectItem>
                <SelectItem value="right_column">Right Column</SelectItem>
                <SelectItem value="marketplace">Marketplace</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="adFormat">Ad Format*</Label>
            <Select
              value={formData.facebook?.adFormat || ''}
              onValueChange={(value) => updateFacebookData({ adFormat: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ad format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="collection">Collection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="creativeType">Creative Type*</Label>
            <Input
              id="creativeType"
              value={formData.facebook?.creativeType || ''}
              onChange={(e) => updateFacebookData({ creativeType: e.target.value })}
              placeholder="Enter creative type"
              required
            />
          </div>
        </div>
      )
    case 3:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="callToAction">Call to Action*</Label>
            <Select
              value={formData.facebook?.callToAction || ''}
              onValueChange={(value) => updateFacebookData({ callToAction: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select call to action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop_now">Shop Now</SelectItem>
                <SelectItem value="learn_more">Learn More</SelectItem>
                <SelectItem value="sign_up">Sign Up</SelectItem>
                <SelectItem value="book_now">Book Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="headline">Headline*</Label>
            <Input
              id="headline"
              value={formData.facebook?.headline || ''}
              onChange={(e) => updateFacebookData({ headline: e.target.value })}
              placeholder="Enter headline"
              required
            />
          </div>
        </div>
      )
    case 4:
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="text">Ad Text*</Label>
            <Input
              id="text"
              value={formData.facebook?.text || ''}
              onChange={(e) => updateFacebookData({ text: e.target.value })}
              placeholder="Enter ad text"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL*</Label>
            <Input
              id="imageUrl"
              value={formData.facebook?.imageUrl || ''}
              onChange={(e) => updateFacebookData({ imageUrl: e.target.value })}
              placeholder="Enter image URL"
              required
              type='image'
            />
          </div>
        </div>
      )
    default:
      return null
  }
}

