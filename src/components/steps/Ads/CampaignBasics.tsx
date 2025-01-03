"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCampaignContext } from "@/context/CampaignFormContext";

const schema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  budgetAmount: z.number().min(1600, "Budget Amount cannot be less than (NGN) 1600"),
  duration: z.number().min(1, "Duration is Required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type CampaignBasicsProps = {
  onNext: (data: z.infer<typeof schema>) => void;
};

export default function CampaignBasics({ onNext }: CampaignBasicsProps) {
  const { campaignData, updateCampaignData } = useCampaignContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      campaignName: campaignData.campaignName,
      budgetAmount: campaignData.budgetAmount,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      duration: 1,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("hello");
    updateCampaignData(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input
          id="campaignName"
          {...register("campaignName")}
          placeholder="Enter Campaign Name"
        />
        {errors.campaignName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.campaignName.message}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium">Budget</h3>
          <div className="mt-2">
            <Label htmlFor="budgetAmount">Budget Amount(NGN)</Label>
            <Input
              id="budgetAmount"
              type="number"
              {...register("budgetAmount", { valueAsNumber: true })}
              placeholder="Enter Daily Budget"
            />
            {errors.budgetAmount ? (
              <p className="text-red-500 text-sm mt-1">
                {errors.budgetAmount.message}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">
                Budget Amount cannot be less than (NGN) 1600
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium">Duration</h3>
          <div className="mt-2">
            <Label htmlFor="duration">Duration (days)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration", { valueAsNumber: true })}
              placeholder="Enter campaign duration in days"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Schedule (Optional)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Setting a schedule is optional but can help optimize your campaign.
        </p>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
