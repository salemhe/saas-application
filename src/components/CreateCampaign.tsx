"use client";

import React, { Suspense, useState } from "react";
import {
  CampaignProvider,
  useCampaignContext,
} from "@/context/CampaignFormContext";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const PlatformSelection = dynamic(() => import("./steps/Ads/PlatformSelection"))
const CampaignBasics = dynamic(() => import("./steps/Ads/CampaignBasics"))
const AudienceTargeting = dynamic(() => import("./steps/Ads/AudienceTargeting"));
const AdPlacement = dynamic(() => import("./steps/Ads/AdPlacement"));
const CreativeSetup = dynamic(() => import("./steps/Ads/CreativeSetup"));
const ReviewLaunch = dynamic(() => import("./steps/Ads/ReviewLaunch"));

const steps = [
  "Platform Selection",
  "Campaign Basics",
  "Audience Targeting",
  "Ad Placement",
  "Creative Setup",
  "Review and Launch",
];

function CampaignWizardContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const { updateCampaignData } = useCampaignContext();

  const handleNext = (data: any) => {
    updateCampaignData(data);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PlatformSelection onNext={handleNext} />;
      case 1:
        return <CampaignBasics onNext={handleNext} />;
      case 2:
        return <AudienceTargeting onNext={handleNext} />;
      case 3:
        return <AdPlacement onNext={handleNext} />;
      case 4:
        return <CreativeSetup onNext={handleNext} />;
      case 5:
        return <ReviewLaunch />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Campaign Setup</CardTitle>
          <CardDescription>
            <div className="mb-6 overflow-x-auto mt-6">
              <ol className="flex items-center w-full text-xs md:text-sm font-medium text-center text-gray-500 flex-wrap rounded-lg border-2 border-dashed p-6 gap-4">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className={`flex items-center ${
                      index <= currentStep ? "text-blue-600" : ""
                    }`}
                  >
                    <span className="flex items-center after:content-['/'] after:mx-2 after:text-gray-200">
                      {index < currentStep ? (
                        <div>
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                          </svg>
                        </div>
                      ) : (
                        <span
                          className={`mr-2 ${
                            index === currentStep ? "text-blue-600" : ""
                          }`}
                        >
                          {index + 1}
                        </span>
                      )}
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="w-full h-[1000px]" />}>
            {renderStep()}
          </Suspense>
          <div className="flex mt-2 w-full items-center justify-center">
            {currentStep > 0 && <Button className="bg-transparent text-primary hover:opacity-80 hover:bg-transparent font-bold p-1" onClick={handleBack}>Back</Button>}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function CreateCampaign() {
  return (
    <CampaignProvider>
      <CampaignWizardContent />
    </CampaignProvider>
  );
}
