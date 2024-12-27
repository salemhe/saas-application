"use client";

import React, { useEffect } from "react";
import { useCampaignForm } from "@/context/CampaignFormContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const FacebookAdPreview = ({ data }: {data: any}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt="Page avatar" />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Your Page Name</p>
            <p className="text-sm text-gray-500">
              Sponsored · {data.placement}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{data.text}</p>
        {data.imageUrl && (
          <img src={data.imageUrl} alt="Ad" className="w-full h-48 object-cover rounded-md mb-2" />
        )}
        <h3 className="font-bold text-lg">{data.headline}</h3>
        <p className="text-sm text-gray-600 mb-2">
          {data.description || "Your website description here"}
        </p>
        <Button className="w-full">{data.callToAction}</Button>
      </CardContent>
    </Card>
  );
};

const GoogleAdPreview = ({ data }: {data: any}) => {
  switch (data.adType) {
    case "text":
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="mb-1">
              <span className="text-sm bg-yellow-100 px-1">Ad</span>
              <span className="text-sm text-gray-500 ml-2">
                {data.displayUrl}
              </span>
            </div>
            <h3 className="text-xl font-medium text-blue-700">
              {data.headline}
            </h3>
            <p className="text-sm">{data.description}</p>
          </CardContent>
        </Card>
      );
    case "responsive_search":
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="mb-1">
              <span className="text-sm bg-yellow-100 px-1">Ad</span>
              <span className="text-sm text-gray-500 ml-2">
                {data.displayUrl}
              </span>
            </div>
            <h3 className="text-xl font-medium text-blue-700">
              {data.headline}
            </h3>
            <p className="text-sm">{data.description}</p>
            {data.callToAction && (
              <Button variant="outline" size="sm" className="mt-2">
                {data.callToAction}
              </Button>
            )}
          </CardContent>
        </Card>
      );
    case "display":
    case "video":
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            {data.imageUrl && (
          <img src={data.imageUrl} alt="Ad" className="w-full h-48 object-cover rounded-md mb-2" />
            )}
            <h3 className="text-xl font-medium">{data.headline}</h3>
            <p className="text-sm mb-2">{data.description}</p>
            {data.callToAction && (
              <Button size="sm">{data.callToAction}</Button>
            )}
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

const TwitterAdPreview = ({ data }: {data: any}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Profile avatar" />
              <AvatarFallback>@</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Your Account</p>
              <p className="text-sm text-gray-500">@youraccount</p>
            </div>
          </div>
          {/* <Badge variant="secondary">Ad</Badge> */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{data.tweetText}</p>
        {data.imageUrl && (
          <img src={data.imageUrl} alt="Ad" className="w-full h-48 object-cover rounded-md mb-2" />
        )}
        {data.websiteUrl && (
          <p className="text-sm text-gray-600 mb-2">{data.websiteUrl}</p>
        )}
        <Button className="w-full">{data.callToAction}</Button>
      </CardContent>
    </Card>
  );
};

const AdPreview = ({ platform, data }: {platform: string; data: any}) => {
  if (!data) return null;

  switch (platform) {
    case "facebook":
      return <FacebookAdPreview data={data} />;
    case "google":
      return <GoogleAdPreview data={data} />;
    case "twitter":
      return <TwitterAdPreview data={data} />;
    default:
      return null;
  }
};

export default function Review() {
  const { formData } = useCampaignForm();

  useEffect(() => {
    if (formData.platform) {
      console.log(
        `Form data for ${formData.platform} campaign:`,
        formData[formData.platform]
      );
    }
  }, [formData]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Review Your Campaign</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
            <p>
              <strong>Budget:</strong> ${formData.budget}
            </p>
            <p>
              <strong>Start Date:</strong> {formData.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {formData.endDate}
            </p>
            <p>
              <strong>Platform:</strong> {formData.platform}
            </p>
          </CardContent>
        </Card>
        {formData.platform && formData[formData.platform] && (
          <Card>
            <CardHeader>
              <CardTitle>
                {formData.platform.charAt(0).toUpperCase() +
                  formData.platform.slice(1)}{" "}
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(formData[formData.platform]).map(
                ([key, value]) => (
                  <p key={key}>
                    <strong>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </strong>{" "}
                    {Array.isArray(value) ? value.join(", ") : value}
                  </p>
                )
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {formData.platform && formData[formData.platform] && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Ad Preview</h3>
          <AdPreview
            platform={formData.platform}
            data={formData[formData.platform]}
          />
        </div>
      )}
    </div>
  );
}
