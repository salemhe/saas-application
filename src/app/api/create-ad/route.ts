// app/api/create-ad/route.ts
import { NextResponse } from 'next/server';

const FB_API_VERSION = "v18.0";
const BASE_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

export async function POST(request: Request) {
  try {
    const { 
      accessToken, 
      adAccountId, 
      campaignName, 
      adSetName, 
      creativeName, 
      link, 
      imageUrl 
    } = await request.json();

    if (!accessToken || !adAccountId) {
      return NextResponse.json(
        { error: "Access token and ad account ID are required" },
        { status: 400 }
      );
    }

    // Step 1: Create a Campaign
    const campaignResponse = await fetch(`${BASE_URL}/act_${adAccountId}/campaigns`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${accessToken}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        name: campaignName,
        objective: "LINK_CLICKS",
        status: "ACTIVE",
      }),
    });
    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.id;

    // Step 2: Create an Ad Set
    const adSetResponse = await fetch(`${BASE_URL}/act_${adAccountId}/adsets`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${accessToken}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        name: adSetName,
        campaign_id: campaignId,
        daily_budget: 1000, // Minimum 1000 (10.00 units in most currencies)
        billing_event: "IMPRESSIONS",
        optimization_goal: "REACH",
        start_time: new Date().toISOString(),
        targeting: {
          geo_locations: { countries: ["US"] },
        },
        status: "ACTIVE",
      }),
    });
    const adSetData = await adSetResponse.json();
    const adSetId = adSetData.id;

    // Step 3: Create an Ad Creative
    const creativeResponse = await fetch(`${BASE_URL}/act_${adAccountId}/adcreatives`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${accessToken}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        name: creativeName,
        object_story_spec: {
          link_data: {
            link,
            image_hash: imageUrl,
            message: "Check out our amazing product!",
          },
          page_id: "YOUR_PAGE_ID",
        },
      }),
    });
    const creativeData = await creativeResponse.json();
    const creativeId = creativeData.id;

    // Step 4: Create the Ad
    const adResponse = await fetch(`${BASE_URL}/act_${adAccountId}/ads`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${accessToken}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        name: "My New Ad",
        adset_id: adSetId,
        creative: { creative_id: creativeId },
        status: "ACTIVE",
      }),
    });
    const adData = await adResponse.json();

    return NextResponse.json({ 
      message: "Ad created successfully!", 
      adId: adData.id 
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the ad." },
      { status: 500 }
    );
  }
}