"use client";

import { Button } from "@/components/ui/button";
import { useCampaignContext } from "@/context/CampaignFormContext";
import AdPreview from "../preview/AdPreview";
import { useState } from "react";

export default function ReviewLaunch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { campaignData } = useCampaignContext();

  const createFacebookAd = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Please connect your Facebook Ads account first");
      setIsLoading(false);
    }

    try {
      // Create Ad Campaign
      const campaignResponse = await fetch(
        "https://graph.facebook.com/v18.0/1312563242994065/campaigns", // Please add the 1312563242994065
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: `${campaignData.campaignName} Campaign`,
            objective: "LINK_CLICKS",
            status: "PAUSED", // Start paused for review
            special_ad_categories: [],
          }),
        }
      );

      const createCampaign = await campaignResponse.json();
      if (!campaignResponse.ok) throw new Error(createCampaign.error?.message);

      // Create Ad Set
      const adSetResponse = await fetch(
        `https://graph.facebook.com/v18.0/1312563242994065/adsets`, // Please add the 1312563242994065
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: `${campaignData.campaignName} Ad Set`,
            campaign_id: createCampaign.id,
            daily_budget: Number(campaignData.dailyBudget) * 100, // Convert to cents
            billing_event: "IMPRESSIONS",
            optimization_goal: "LINK_CLICKS",
            bid_strategy: "LOWEST_COST_WITHOUT_CAP",
            targeting: {
              age_min: campaignData.ageMin,
              age_max: campaignData.ageMax,
              genders: [1, 2],
              geo_locations: {
                countries: ["US"],
              },
            },
            status: "PAUSED",
            end_time: new Date(
              Date.now() + Number(campaignData.duration) * 24 * 60 * 60 * 1000
            ).toISOString(),
          }),
        }
      );

      const adSetData = await adSetResponse.json();
      if (!adSetResponse.ok) throw new Error(adSetData.error?.message);

      // Create Ad Creative
      const creativeResponse = await fetch(
        `https://graph.facebook.com/v18.0/1312563242994065/adcreatives`, // Please add the 1312563242994065
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: `${campaignData.campaignName} Creative`,
            object_story_spec: {
              page_id: "YOUR_PAGE_ID",
              link_data: {
                message: campaignData.description,
                link: campaignData.linkUrl,
                call_to_action: {
                  type: campaignData.callToAction,
                },
                name: campaignData.headline,
              },
            },
          }),
        }
      );

      const creativeData = await creativeResponse.json();
      if (!creativeResponse.ok) throw new Error(creativeData.error?.message);

      // Create Ad
      const adResponse = await fetch(
        `https://graph.facebook.com/v18.0/1312563242994065/ads`, // Please add the 1312563242994065
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
            name: campaignData.campaignName,
            adset_id: adSetData.id,
            creative: { creative_id: creativeData.id },
            status: "PAUSED",
          }),
        }
      );

      const adResponseData = await adResponse.json();
      if (!adResponse.ok) throw new Error(adResponseData.error?.message);

      setSuccess(
        "Ad created successfully! Please review and activate it in your Facebook Ads Manager."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ad");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunch = async () => {
    console.log("Campaign Data:", campaignData);
    if (campaignData.platform === "facebook") {
      createFacebookAd();
    } else {
      alert("nothing set for Instagram Campaign Yet.");
    }
  };

  const filesArray = Array.from(campaignData.media);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Campaign</h2>
      <div className="flex flex-col">
        {Object.entries({
          ...campaignData,
          // URL is to be fetched from the backend, you can use cloudinary
          media: filesArray.map((item: any) => item.name),
        }).map(([key, value]) => (
          <div
            key={key}
            className=" gap-2 grid grid-cols-2 break-words justify-between md:text-base odd:bg-slate-200 py-2 px-2"
          >
            <span className="font-bold text-sm">{key.toUpperCase()}:</span>
            <span className="text-xs md:text-sm w-full flex-1 gap-2 break-words">
              {typeof value === "object"
                ? value.join(", ").toUpperCase()
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
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {success && <div className="text-green-500 text-sm">{success}</div>}
      <Button className="w-full" onClick={handleLaunch}>
        {isLoading ? "Launching Campaign..." : "Launch Campaign"}
      </Button>
    </div>
  );
}
