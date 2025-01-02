'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type CampaignData = {
  [key: string]: any
}

type CampaignContextType = {
  campaignData: CampaignData
  updateCampaignData: (data: Partial<CampaignData>) => void
  saveDraft: () => void
  loadDraft: () => void
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export const useCampaignContext = () => {
  const context = useContext(CampaignContext)
  if (!context) {
    throw new Error('useCampaignContext must be used within a CampaignProvider')
  }
  return context
}

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [campaignData, setCampaignData] = useState<CampaignData>({})
  useEffect(() => {
      loadDraft()
  }, []);

  const updateCampaignData = (data: Partial<CampaignData>) => {
    setCampaignData((prev) => {
      const newData = { ...prev, ...data }
      // localStorage.setItem('campaignDraft', JSON.stringify(newData))
      return newData
    })
  }

  const saveDraft = () => {
    localStorage.setItem('campaignDraft', JSON.stringify(campaignData))
  }

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('campaignDraft')
    if (savedDraft) {
      setCampaignData(JSON.parse(savedDraft))
    }
  }

  return (
    <CampaignContext.Provider value={{ campaignData, updateCampaignData, saveDraft, loadDraft }}>
      {children}
    </CampaignContext.Provider>
  )
}

