"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampaignContext } from "@/context/CampaignFormContext";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const schema = z.object({
  platform: z.enum(["facebook", "instagram"], {
    required_error: "Please select a platform",
  }),
  objective: z.enum(["awareness", "consideration", "conversion"], {
    required_error: "Please select an objective",
  }),
});

type PlatformSelectionProps = {
  onNext: (data: z.infer<typeof schema>) => void;
};

export default function PlatformSelection({ onNext }: PlatformSelectionProps) {
  const { campaignData, updateCampaignData } = useCampaignContext();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: campaignData.platform,
      objective: campaignData.objective,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCampaignData(data);
    onNext(data);
  };

  const platform = watch("platform");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Choose Platform</h3>
        <RadioGroup
          className="grid gap-4 sm:grid-cols-2"
          onValueChange={(value) =>
            setValue("platform", value as "facebook" | "instagram")
          }
        >
          <Label
            htmlFor="facebook"
            className={` bg-blue-50 bg-opacity-20 hover:bg-opacity-90 border-2 hover:cursor-pointer w-full h-[200px] rounded-xl p-10 flex flex-col items-center gap-4 ${
              platform === "facebook" && "border-blue-600 bg-opacity-95"
            }`}
          >
            <FaFacebook
              fill="#3333ff"
              size={24}
              className="size-9 md:size-14"
            />
            <h2 className="text-primary text-lg">Facebook</h2>
            <RadioGroupItem value="facebook" id="facebook" className="hidden" />
          </Label>
          <Label
            htmlFor="instagram"
            className={` bg-blue-50 bg-opacity-20 hover:bg-opacity-90 border-2 hover:cursor-pointer w-full h-[200px] rounded-xl p-10 flex flex-col items-center gap-4 ${
              platform === "instagram" && "border-blue-600 bg-opacity-95"
            }`}
          >
            <FaInstagram
              fill="#ff6666"
              size={24}
              className="size-9 md:size-14"
            />
            <h2 className="text-primary text-lg">Instagram</h2>
            <RadioGroupItem
              value="instagram"
              id="instagram"
              className="hidden"
            />
          </Label>
        </RadioGroup>
        {errors.platform && (
          <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium">Select Objective</h3>
        <Controller
          name="objective"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="consideration">Consideration</SelectItem>
                <SelectItem value="conversion">Conversion</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.objective && (
          <p className="text-red-500 text-sm mt-1">
            {errors.objective.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
