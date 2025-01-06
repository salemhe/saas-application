"use client";

import { Button } from "@/components/ui/button";
import { useCampaignContext } from "@/context/CampaignFormContext";
import AdPreview from "../preview/AdPreview";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../../../firebase";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";

interface FacebookAdAccount {
  id: string;
  name: string;
  account_status: number;
}

interface FacebookAccount {
  accessToken: string;
  adAccounts: FacebookAdAccount[];
  pages: Array<{ id: string }>;
  isConnected: boolean;
}

interface UserData {
  accounts?: {
    Facebook?: FacebookAccount;
  };
}

export default function ReviewLaunch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { accessToken, isTokenExpired, getValidToken, refreshFacebookToken } =
    useFacebookAuth();
  const { campaignData } = useCampaignContext();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await getValidToken();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Please reconnect your Facebook account");
      }
    };

    if (!accessToken || isTokenExpired) {
      validateToken();
    }
  }, [accessToken, isTokenExpired, getValidToken]);

  const validateCampaignData = () => {
    if (!campaignData) {
      throw new Error("Campaign data is missing");
    }

    const requiredFields = [
      "dailyBudget",
      "campaignName",
      "duration",
      "ageMin",
      "ageMax",
    ];
    const missingFields = requiredFields.filter(
      (field) => !campaignData[field]
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    const budget = campaignData.dailyBudget;
    if (budget === undefined || budget === null) {
      throw new Error("Daily budget is required");
    }

    const parsedBudget =
      typeof budget === "string"
        ? parseFloat(budget.replace(/[^0-9.]/g, ""))
        : Number(budget);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      throw new Error(
        `Invalid daily budget: ${budget}. Must be a positive number.`
      );
    }

    return parsedBudget;
  };

  const createFacebookAd = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const validatedBudget = validateCampaignData();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      let token;
      try {
        // First try getting the existing token
        token = await getValidToken();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // If that fails, try refreshing the token
        try {
          token = await refreshFacebookToken();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (refreshErr) {
          throw new Error(
            "Failed to authenticate with Facebook. Please try reconnecting your account."
          );
        }
      }

      if (!token) {
        throw new Error("Unable to obtain valid Facebook access token");
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data() as UserData | undefined;

      if (!userData?.accounts?.Facebook?.adAccounts?.length) {
        throw new Error(
          "No Facebook ad accounts found. Please check your Facebook Business Manager settings."
        );
      }

      if (!userData.accounts.Facebook.pages?.length) {
        throw new Error(
          "No Facebook pages found. Please connect a Facebook page to your account."
        );
      }

      const { adAccounts, pages } = userData.accounts.Facebook;

      if (!adAccounts?.[0]?.id || !pages?.[0]?.id) {
        throw new Error(
          "Missing Facebook account information. Please reconnect your Facebook account."
        );
      }

      const adAccountId = adAccounts[0].id;
      const pageId = pages[0].id;

      const dailyBudgetInCents = Math.max(
        Math.round(validatedBudget * 100),
        100
      );

      // Ensure minimum duration of 1 day (24 hours)
      const duration = Math.max(Number(campaignData.duration), 1);

      // Calculate start time as the next hour to ensure proper scheduling
      const startTime = new Date();
      startTime.setMinutes(0, 0, 0); // Reset minutes and seconds to zero
      startTime.setHours(startTime.getHours() + 1); // Start from next hour

      // Calculate end time by adding full days
      const endTime = new Date(startTime.getTime());
      endTime.setDate(endTime.getDate() + duration);

      // Validate the time difference is at least 24 hours
      const timeDifferenceHours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      if (timeDifferenceHours < 24) {
        throw new Error("Campaign duration must be at least 24 hours");
      }

      console.log("Debug - Start Time:", startTime.toISOString());
      console.log("Debug - End Time:", endTime.toISOString());
      console.log("Debug - Duration (hours):", timeDifferenceHours);

      // Create Campaign
      const campaignResponse = await fetch(
        `https://graph.facebook.com/v18.0/${adAccountId}/campaigns`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: token,
            name: `${campaignData.campaignName} Campaign`,
            objective: "OUTCOME_TRAFFIC",
            status: "PAUSED",
            special_ad_categories: [],
          }),
        }
      );

      if (!campaignResponse.ok) {
        const errorData = await campaignResponse.json();
        throw new Error(
          errorData.error?.message || "Failed to create campaign"
        );
      }
      const createCampaign = await campaignResponse.json();

      // Create Ad Set
      // Updated Ad Set creation with proper scheduling
      const adSetResponse = await fetch(
        `https://graph.facebook.com/v18.0/${adAccountId}/adsets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: token,
            name: `${campaignData.campaignName} Ad Set`,
            campaign_id: createCampaign.id,
            daily_budget: dailyBudgetInCents,
            optimization_goal: "LINK_CLICKS",
            billing_event: "IMPRESSIONS",
            bid_strategy: "LOWEST_COST_WITHOUT_CAP",
            targeting: {
              age_min: parseInt(campaignData.ageMin),
              age_max: parseInt(campaignData.ageMax),
              genders: [1, 2],
              geo_locations: {
                countries: ["US"],
              },
            },
            status: "PAUSED",
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
            destination_type: "WEBSITE",
            promoted_object: {
              page_id: pageId,
            },
          }),
        }
      );

      if (!adSetResponse.ok) {
        const adSetError = await adSetResponse.json();
        console.log("Debug - Ad Set Error Response:", adSetError);

        // Enhanced error handling for ad set creation
        if (adSetError.error) {
          switch (adSetError.error.error_subcode) {
            case 1487793:
              throw new Error(
                `Invalid campaign schedule: ${
                  adSetError.error.error_user_msg || "Must be at least 24 hours"
                }`
              );
            case 1487706:
              throw new Error(
                "Your ad account doesn't have permission to create ads"
              );
            default:
              throw new Error(
                adSetError.error.message || "Failed to create ad set"
              );
          }
        }
        throw new Error("Failed to create ad set: Unknown error");
      }

      const adSetData = await adSetResponse.json();

      // Create Creative
      const creativeResponse = await fetch(
        `https://graph.facebook.com/v18.0/${adAccountId}/adcreatives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: token,
            name: `${campaignData.campaignName} Creative`,
            object_story_spec: {
              page_id: pageId,
              link_data: {
                message: campaignData.description || "Default ad message",
                link: campaignData.linkUrl || "https://example.com",
                call_to_action: {
                  type: campaignData.callToAction || "LEARN_MORE",
                },
                name: campaignData.headline || "Default headline",
              },
            },
          }),
        }
      );

      if (!creativeResponse.ok) {
        const creativeError = await creativeResponse.json();
        console.error("Debug - Creative Error Response:", creativeError);

        throw new Error(
          creativeError.error?.message || "Failed to create creative"
        );
      }

      const creativeData = await creativeResponse.json();

      // Create Ad
      const adResponse = await fetch(
        `https://graph.facebook.com/v18.0/${adAccountId}/ads`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: token,
            name: campaignData.campaignName,
            adset_id: adSetData.id,
            creative: { creative_id: creativeData.id },
            status: "PAUSED",
          }),
        }
      );

      if (!adResponse.ok) {
        const adError = await adResponse.json();
        throw new Error(adError.error?.message || "Failed to create ad");
      }
      const adResponseData = await adResponse.json();

      // Save to Firestore
      const adRef = doc(collection(db, "users", user.uid, "ads"));
      await setDoc(adRef, {
        campaignId: createCampaign.id,
        adSetId: adSetData.id,
        adId: adResponseData.id,
        creativeId: creativeData.id,
        platform: campaignData.platform,
        status: "PAUSED",
        details: {
          name: campaignData.campaignName,
          budget: campaignData.dailyBudget,
          duration: campaignData.duration,
          targeting: {
            ageMin: campaignData.ageMin,
            ageMax: campaignData.ageMax,
          },
          creative: {
            headline: campaignData.headline,
            description: campaignData.description,
            callToAction: campaignData.callToAction,
            linkUrl: campaignData.linkUrl,
          },
        },
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      });

      setSuccess(
        "Ad created successfully! Please review and activate it in your Facebook Ads Manager."
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create ad";
      setError(errorMessage);
      console.error("Ad Creation Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunch = async () => {
    createFacebookAd();
  };

  const filesArray = Array.from(campaignData.media);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Campaign</h2>
      {(isTokenExpired || !accessToken) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Your Facebook connection needs to be renewed. Please reconnect your
          account.
        </div>
      )}
      <div className="flex flex-col">
        {Object.entries({
          ...campaignData,
          media: filesArray.map((item: any) => item.name),
          callToAction: campaignData.callToAction.replace("_", " "),
        }).map(([key, value]) => (
          <div
            key={key}
            className="gap-2 grid grid-cols-2 break-words justify-between md:text-base odd:bg-slate-200 py-2 px-2"
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
            cta={campaignData.callToAction.replace("_", " ")}
            link={campaignData.linkUrl}
          />
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      <Button className="w-full" onClick={handleLaunch}>
        {isLoading ? "Launching Campaign..." : "Launch Campaign"}
      </Button>
    </div>
  );
}
