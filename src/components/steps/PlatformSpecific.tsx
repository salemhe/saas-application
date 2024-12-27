'use client'

import React from 'react'
import { useCampaignForm } from '@/context/CampaignFormContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function PlatformSpecific() {
  const { formData, updateFormData } = useCampaignForm()

  const updatePlatformData = (platform: string, data: any) => {
    updateFormData({
      platformSpecificData: {
        ...formData.platformSpecificData,
        [platform]: {
          ...formData.platformSpecificData[platform],
          ...data
        }
      }
    })
  }

  return (
    <div className="space-y-8">
      {formData.platforms.includes('facebook') && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Facebook</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="facebook-audience">Target Audience</Label>
              <Input
                id="facebook-audience"
                value={formData.platformSpecificData.facebook?.audience || ''}
                onChange={(e) => updatePlatformData('facebook', { audience: e.target.value })}
                placeholder="Enter target audience"
              />
            </div>
            <div>
              <Label htmlFor="facebook-placement">Ad Placement</Label>
              <Input
                id="facebook-placement"
                value={formData.platformSpecificData.facebook?.placement || ''}
                onChange={(e) => updatePlatformData('facebook', { placement: e.target.value })}
                placeholder="Enter ad placement"
              />
            </div>
          </div>
        </div>
      )}
      {formData.platforms.includes('google') && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Google</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="google-keywords">Keywords</Label>
              <Textarea
                id="google-keywords"
                value={formData.platformSpecificData.google?.keywords?.join(', ') || ''}
                onChange={(e) => updatePlatformData('google', { keywords: e.target.value.split(',').map(k => k.trim()) })}
                placeholder="Enter keywords (comma-separated)"
              />
            </div>
            <div>
              <Label htmlFor="google-adType">Ad Type</Label>
              <Input
                id="google-adType"
                value={formData.platformSpecificData.google?.adType || ''}
                onChange={(e) => updatePlatformData('google', { adType: e.target.value })}
                placeholder="Enter ad type"
              />
            </div>
          </div>
        </div>
      )}
      {formData.platforms.includes('twitter') && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Twitter</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="twitter-hashtags">Hashtags</Label>
              <Textarea
                id="twitter-hashtags"
                value={formData.platformSpecificData.twitter?.hashtags?.join(', ') || ''}
                onChange={(e) => updatePlatformData('twitter', { hashtags: e.target.value.split(',').map(h => h.trim()) })}
                placeholder="Enter hashtags (comma-separated)"
              />
            </div>
            <div>
              <Label htmlFor="twitter-targetUsers">Target Users</Label>
              <Textarea
                id="twitter-targetUsers"
                value={formData.platformSpecificData.twitter?.targetUsers?.join(', ') || ''}
                onChange={(e) => updatePlatformData('twitter', { targetUsers: e.target.value.split(',').map(u => u.trim()) })}
                placeholder="Enter target users (comma-separated)"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

