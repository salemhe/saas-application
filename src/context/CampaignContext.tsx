import React, { createContext, useState } from 'react';

interface CampaignType {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Campaign = createContext<CampaignType>({
  isConnected: false,
  setIsConnected: () => {}
});

export const CampaignProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(true);

  return (
    <Campaign.Provider value={{ isConnected, setIsConnected }}>
      {children}
    </Campaign.Provider>
  );
};
