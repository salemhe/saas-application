'use client'

import React from 'react'
import { useCampaignForm } from '@/context/CampaignFormContext'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function BasicInfo() {
  const { formData, updateFormData } = useCampaignForm()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Campaign Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter campaign name"
            required
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget*</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget !== null ? formData.budget : ''}
            onChange={(e) => updateFormData({ budget: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="Enter campaign budget"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description*</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Enter campaign description"
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData({ startDate: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date*</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => updateFormData({ endDate: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  )
}

