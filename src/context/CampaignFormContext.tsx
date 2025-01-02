"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type CampaignData = {
  [key: string]: any;
};

type CampaignContextType = {
  campaignData: CampaignData;
  updateCampaignData: (data: Partial<CampaignData>) => void;
};

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined
);

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      "useCampaignContext must be used within a CampaignProvider"
    );
  }
  return context;
};

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [campaignData, setCampaignData] = useState<CampaignData>({});

  const updateCampaignData = (data: Partial<CampaignData>) => {
    setCampaignData((prev) => {
      const newData = { ...prev, ...data };
      return newData;
    });
  };

  return (
    <CampaignContext.Provider
      value={{ campaignData, updateCampaignData }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
