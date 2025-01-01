"use client"
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FacebookAdCreator = () => {
  const [adData, setAdData] = useState({
    name: '',
    headline: '',
    description: '',
    websiteUrl: '',
    callToAction: 'LEARN_MORE',
    dailyBudget: '',
    duration: '7',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const callToActionOptions = [
    { value: 'LEARN_MORE', label: 'Learn More' },
    { value: 'SHOP_NOW', label: 'Shop Now' },
    { value: 'SIGN_UP', label: 'Sign Up' },
    { value: 'BOOK_NOW', label: 'Book Now' },
    { value: 'CONTACT_US', label: 'Contact Us' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAdData(prev => ({ ...prev, [name]: value }));
  };

  const createFacebookAd = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Please connect your Facebook Ads account first');
      setIsLoading(false);
      return;
    }

    try {
      // Create Ad Campaign
      const campaignResponse = await fetch('https://graph.facebook.com/v18.0/act_YOUR_AD_ACCOUNT_ID/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${adData.name} Campaign`,
          objective: 'LINK_CLICKS',
          status: 'PAUSED', // Start paused for review
          special_ad_categories: [],
        }),
      });

      const campaignData = await campaignResponse.json();
      if (!campaignResponse.ok) throw new Error(campaignData.error?.message);

      // Create Ad Set
      const adSetResponse = await fetch(`https://graph.facebook.com/v18.0/act_YOUR_AD_ACCOUNT_ID/adsets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${adData.name} Ad Set`,
          campaign_id: campaignData.id,
          daily_budget: Number(adData.dailyBudget) * 100, // Convert to cents
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'LINK_CLICKS',
          bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
          targeting: {
            age_min: 18,
            age_max: 65,
            genders: [1, 2],
            geo_locations: {
              countries: ['US'],
            },
          },
          status: 'PAUSED',
          end_time: new Date(Date.now() + Number(adData.duration) * 24 * 60 * 60 * 1000).toISOString(),
        }),
      });

      const adSetData = await adSetResponse.json();
      if (!adSetResponse.ok) throw new Error(adSetData.error?.message);

      // Create Ad Creative
      const creativeResponse = await fetch(`https://graph.facebook.com/v18.0/act_YOUR_AD_ACCOUNT_ID/adcreatives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          name: `${adData.name} Creative`,
          object_story_spec: {
            page_id: 'YOUR_PAGE_ID',
            link_data: {
              message: adData.description,
              link: adData.websiteUrl,
              call_to_action: {
                type: adData.callToAction,
              },
              name: adData.headline,
            },
          },
        }),
      });

      const creativeData = await creativeResponse.json();
      if (!creativeResponse.ok) throw new Error(creativeData.error?.message);

      // Create Ad
      const adResponse = await fetch(`https://graph.facebook.com/v18.0/act_YOUR_AD_ACCOUNT_ID/ads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accessToken,
          name: adData.name,
          adset_id: adSetData.id,
          creative: { creative_id: creativeData.id },
          status: 'PAUSED',
        }),
      });

      const adResponseData = await adResponse.json();
      if (!adResponse.ok) throw new Error(adResponseData.error?.message);

      setSuccess('Ad created successfully! Please review and activate it in your Facebook Ads Manager.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ad');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create Facebook Ad</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Ad Name</label>
          <Input
            name="name"
            value={adData.name}
            onChange={handleInputChange}
            placeholder="Enter ad name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Headline</label>
          <Input
            name="headline"
            value={adData.headline}
            onChange={handleInputChange}
            placeholder="Enter ad headline"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={adData.description}
            onChange={handleInputChange}
            placeholder="Enter ad description"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
          <Input
            name="websiteUrl"
            value={adData.websiteUrl}
            onChange={handleInputChange}
            placeholder="Enter your website URL"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Call to Action</label>
          <Select
            value={adData.callToAction}
            onValueChange={(value) => handleSelectChange('callToAction', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {callToActionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Daily Budget (USD)</label>
          <Input
            name="dailyBudget"
            type="number"
            value={adData.dailyBudget}
            onChange={handleInputChange}
            placeholder="Enter daily budget"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (Days)</label>
          <Input
            name="duration"
            type="number"
            value={adData.duration}
            onChange={handleInputChange}
            placeholder="Enter campaign duration in days"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        <Button 
          onClick={createFacebookAd} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Creating Ad...' : 'Create Ad'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FacebookAdCreator;