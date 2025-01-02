"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCampaignContext } from "@/context/CampaignFormContext";

const schema = z.object({
  manualPlacements: z
    .array(z.string())
    .min(1, "At least one placement is required")
    .optional(),
  deviceType: z.enum(["all", "mobile", "desktop"], {
    required_error: "Please select a device type",
  }),
});

type AdPlacementProps = {
  onNext: (data: z.infer<typeof schema>) => void;
};

export default function AdPlacement({ onNext }: AdPlacementProps) {
  const { campaignData, updateCampaignData } = useCampaignContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      manualPlacements: campaignData.manualPlacements,
      deviceType: "all",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCampaignData(data);
    onNext(data);
  };

  const placements =
    campaignData.platform === "facebook"
      ? [
          "Feed Ads",
          "Stories Ads",
          "Messenger Ads",
          "Right Column Ads",
          "Video Ads",
        ]
      : ["Feed Ads", "Stories Ads", "Reels Ads", "Explore Ads", "Shopping Ads"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Select Ad Placements</h3>
        <div className="space-y-2">
          <Controller
            name="manualPlacements"
            control={control}
            render={({ field }) => (
              <>
                {placements.map((placement) => (
                  <div key={placement} className="flex items-center space-x-2">
                    <Checkbox
                      id={placement}
                      checked={field.value?.includes(placement)}
                      onCheckedChange={(checked) => {
                        const updatedValue = checked
                          ? [...(field.value || []), placement]
                          : (field.value || []).filter(
                              (value: string) => value !== placement
                            );
                        field.onChange(updatedValue);
                      }}
                    />
                    <Label htmlFor={placement}>{placement}</Label>
                  </div>
                ))}
              </>
            )}
          />
        </div>
        {errors.manualPlacements && (
          <p className="text-red-500 text-sm mt-1">
            {errors.manualPlacements.message}
          </p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-medium">Device Type</h3>
        <Controller
          name="deviceType"
          control={control}
          render={({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-devices" />
                <Label htmlFor="all-devices">All Devices</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile">Mobile Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="desktop" id="desktop" />
                <Label htmlFor="desktop">Desktop Only</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.deviceType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.deviceType.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
