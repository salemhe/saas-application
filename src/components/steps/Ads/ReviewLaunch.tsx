"use client";

import { Button } from "@/components/ui/button";
import { useCampaignContext } from "@/context/CampaignFormContext";
import AdPreview from "../preview/AdPreview";

export default function ReviewLaunch() {
  const { campaignData } = useCampaignContext();

  const handleLaunch = () => {
    console.log("Campaign Data:", campaignData);
    // Here you would typically send the campaignData to your backend or ad platform API
    alert("Campaign launched! Check the console for the campaign data.");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Campaign</h2>
      <div className="flex flex-col">
        {Object.entries({
          ...campaignData,
          media: "url will be fetched from backend",
        }).map(([key, value]) => (
          <div
            key={key}
            className=" gap-2 grid grid-cols-2 break-words justify-between md:text-base odd:bg-slate-200 py-2 px-2"
          >
            <span className="font-bold text-sm">{key.toUpperCase()}:</span>
            <span className="text-xs md:text-sm w-full flex-1 truncate gap-2 break-words">
              {typeof value === "object"
                ? JSON.stringify(value).toUpperCase()
                : String(value).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
      {campaignData && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Ad Preview</h3>
          <AdPreview
            platform={campaignData.platform}
            format={campaignData.format}
            media={campaignData.media}
            primaryText={campaignData.primaryText}
            headline={campaignData.headline}
            cta={campaignData.callToAction}
            link={campaignData.linkUrl}
          />
        </div>
      )}
      <Button className="w-full" onClick={handleLaunch}>
        Launch Campaign
      </Button>
    </div>
  );
}
