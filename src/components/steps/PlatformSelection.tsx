"use client";

import React from "react";
import { useCampaignForm } from "@/context/CampaignFormContext";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const platforms = [
  {
    name: "google",
    icon: <FcGoogle size={24} className="size-9 md:size-14" />,
  },
  {
    name: "facebook",
    icon: <FaFacebook fill="#3333ff" size={24} className="size-9 md:size-14" />,
  },
  {
    name: "twitter",
    icon: <FaXTwitter size={24} className="size-9 md:size-14" />,
  },
];

export default function PlatformSelection() {
  const { formData, updateFormData } = useCampaignForm();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Select Platform*</h2>
      <RadioGroup
        value={formData.platform || ""}
        className="grid gap-4 sm:grid-cols-2"
      >
        {platforms.map((platform, i) => (
          <>
            <Label htmlFor={platform.name} key={i} className="has-[:checked]:border-blue-600 has-[:checked]:bg-opacity-95 bg-blue-50 bg-opacity-20 hover:bg-opacity-90 border-2 hover:cursor-pointer w-full h-[200px] rounded-xl p-10 flex flex-col items-center gap-4">
              {platform.icon}
              <h2 className="text-primary text-lg">{platform.name}</h2>
              <input
                type="radio"
                id={platform.name}
                value={platform.name}
                checked={formData.platform === platform.name}
                onChange={(e) => updateFormData({platform: e.target.value as "facebook" | "google" | "twitter"})}
                name="platform"
                className="hidden"
              />
            </Label>
          </>
        ))}
      </RadioGroup>
    </div>
  );
}
