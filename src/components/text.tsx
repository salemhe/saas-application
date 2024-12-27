"use client";

import React, { Suspense } from "react";
import {
  CampaignFormProvider,
  useCampaignForm,
} from "@/context/CampaignFormContext";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BasicInfo = dynamic(() => import("./steps/BasicInfo"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});
const PlatformSelection = dynamic(() => import("./steps/PlatformSelection"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});
const FacebookSteps = dynamic(() => import("./steps/FacebookSteps"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});
const GoogleSteps = dynamic(() => import("./steps/GoogleSteps"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});
const TwitterSteps = dynamic(() => import("./steps/TwitterSteps"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});
const Review = dynamic(() => import("./steps/Review"), {
  loading: () => <Skeleton className="w-full h-[200px]" />,
});

const steps = [
  "Basic Info",
  "Platform Selection",
  "Platform Specific - Step 1",
  "Platform Specific - Step 2",
  "Platform Specific - Step 3",
  "Platform Specific - Step 4",
  "Review",
];

function CampaignWizardContent() {
  const { formData, currentStep, setCurrentStep, validateStep } =
    useCampaignForm();

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfo />;
      case 1:
        return <PlatformSelection />;
      case 2:
      case 3:
      case 4:
      case 5:
        if (formData.platform === "facebook")
          return <FacebookSteps step={currentStep - 1} />;
        if (formData.platform === "google")
          return <GoogleSteps step={currentStep - 1} />;
        if (formData.platform === "twitter")
          return <TwitterSteps step={currentStep - 1} />;
        return null;
      case 6:
        return <Review />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Create Campaign</h1>
      <div className="mb-6 overflow-x-auto">
        <ol className="flex items-center w-full text-xs md:text-sm font-medium text-center text-gray-500 flex-wrap">
          {steps.map((step, index) => (
            <li
              key={step}
              className={`flex items-center ${index <= currentStep ? "text-blue-600" : ""}`}
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
      <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
        {renderStep()}
      </Suspense>
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
        <Button onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={nextStep}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export default function CampaignWizard() {
  return (
    <CampaignFormProvider>
      <CampaignWizardContent />
    </CampaignFormProvider>
  );
}
