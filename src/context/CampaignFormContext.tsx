'use client'

import React, { createContext, useContext, useState } from 'react'

type Platform = 'facebook' | 'google' | 'twitter'

interface CampaignFormData {
  name: string
  description: string
  budget: number | null
  startDate: string
  endDate: string
  platform: Platform | null
  facebook?: {
    audience?: string
    placement?: string
    adFormat?: string
    creativeType?: string
    callToAction?: string
    headline?: string
    text?: string
    imageUrl?: string
  }
  google?: {
    keywords?: string[]
    adType?: string
    headline?: string
    description?: string
    finalUrl?: string
    displayUrl?: string
    callToAction?: string
    imageUrl?: string
  }
  twitter?: {
    objective?: string
    adFormat?: string
    targetAudience?: string
    interests?: string[]
    tweetText?: string
    websiteUrl?: string
    callToAction?: string
    imageUrl?: string
  }
  platforms: string[];

  platformSpecificData: {

    [key: string]: {

      audience?: string;

      placement?: string;

      keywords?: string[];

      adType?: string;

      hashtags?: string[];

      targetUsers?: string[];

    };
  }
}

interface CampaignFormContextType {
  formData: CampaignFormData
  updateFormData: (newData: Partial<CampaignFormData>) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  validateStep: () => boolean
}

const CampaignFormContext = createContext<CampaignFormContextType | undefined>(undefined)

export const useCampaignForm = () => {
  const context = useContext(CampaignFormContext)
  if (!context) {
    throw new Error('useCampaignForm must be used within a CampaignFormProvider')
  }
  return context
}

export const CampaignFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    description: '',
    budget: null,
    startDate: '',
    endDate: '',
    platform: null,
    platforms: [],
    platformSpecificData: {}
  })

  const [currentStep, setCurrentStep] = useState(0)

  const updateFormData = (newData: Partial<CampaignFormData>) => {
    setFormData(prevData => ({ ...prevData, ...newData }))
  }

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return !!formData.name && !!formData.description && formData.budget !== null && !!formData.startDate && !!formData.endDate
      case 1: // Platform Selection
        return !!formData.platform
      case 2: // Platform Specific - Step 1
        if (formData.platform === 'facebook') return !!formData.facebook?.audience && !!formData.facebook?.placement
        if (formData.platform === 'google') return !!formData.google?.keywords && formData.google?.keywords?.length > 0 && !!formData.google?.adType
        if (formData.platform === 'twitter') return !!formData.twitter?.objective && !!formData.twitter?.adFormat
      case 3: // Platform Specific - Step 2
        if (formData.platform === 'facebook') return !!formData.facebook?.adFormat && !!formData.facebook?.creativeType
        if (formData.platform === 'google') return !!formData.google?.headline && !!formData.google?.description
        if (formData.platform === 'twitter') return !!formData.twitter?.targetAudience && !!formData.twitter?.interests && formData.twitter?.interests?.length > 0
      case 4: // Platform Specific - Step 3
        if (formData.platform === 'facebook') return !!formData.facebook?.callToAction && !!formData.facebook?.headline
        if (formData.platform === 'google') return !!formData.google?.finalUrl && !!formData.google?.displayUrl
        if (formData.platform === 'twitter') return !!formData.twitter?.tweetText && !!formData.twitter?.websiteUrl
      case 5: // Platform Specific - Step 4
        if (formData.platform === 'facebook') return !!formData.facebook?.text && !!formData.facebook?.imageUrl
        if (formData.platform === 'google') return !!formData.google?.callToAction && !!formData.google?.imageUrl
        if (formData.platform === 'twitter') return !!formData.twitter?.callToAction && !!formData.twitter?.imageUrl
      default:
        return true
    }
  }

  return (
    <CampaignFormContext.Provider value={{ formData, updateFormData, currentStep, setCurrentStep, validateStep }}>
      {children}
    </CampaignFormContext.Provider>
  )
}

