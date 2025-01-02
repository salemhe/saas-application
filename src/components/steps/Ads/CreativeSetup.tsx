"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCampaignContext } from "@/context/CampaignFormContext";

const schema = z.object({
  format: z.enum(["feed", "story", "reels", "carousel", "video", "image"], {
    required_error: "Please select an ad format",
  }),
  media: z
    .any()
    .refine((files) => files?.length > 0, "Please upload at least one file"),
  primaryText: z.string().min(1, "Primary text is required"),
  headline: z.string().optional(),
  description: z.string().optional(),
  callToAction: z.string().min(1, "Call-to-action is required"),
  linkUrl: z.string().url("Please enter a valid URL for the landing page"),
});

type CreativeSetupProps = {
  onNext: (data: z.infer<typeof schema>) => void;
};

export default function CreativeSetup({ onNext }: CreativeSetupProps) {
  const { campaignData, updateCampaignData } = useCampaignContext();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      format: campaignData.format || "image",
      primaryText: campaignData.primaryText || "",
      headline: campaignData.headline || "",
      description: campaignData.description || "",
      callToAction: campaignData.callToAction || "",
      linkUrl: campaignData.linkUrl || "",
      media: [],
    },
  });

  const format = watch("format");
  const media = watch("media");
  const ctaOptions = [
    "Shop Now",
    "Sign Up",
    "Learn More",
    "Send Message",
    "Book Now",
    "Download",
    "Get Offer",
    "Watch More",
  ];

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCampaignData(data);
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ad Format</h3>
        {campaignData.platform === "facebook" ? (
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Single Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carousel" id="carousel" />
                  <Label htmlFor="carousel">Carousel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feed" id="feed" />
                  <Label htmlFor="feed">Feed</Label>
                </div>
              </RadioGroup>
            )}
          />
        ) : (
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Single Image</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="carousel" id="carousel" />
                  <Label htmlFor="carousel">Carousel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video">Video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feed" id="feed" />
                  <Label htmlFor="feed">Feed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reels" id="reels" />
                  <Label htmlFor="reels">Reels</Label>
                </div>
              </RadioGroup>
            )}
          />
        )}
        {errors.format && (
          <p className="text-red-500 text-sm mt-1">{errors.format.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="media">Upload Media</Label>
        <Label htmlFor="media" className="cursor-pointer flex items-center justify-center w-full border border-dashed rounded-lg p-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <span>
            {media.length > 0
              ? `${media.length} file${media.length > 1 ? "s" : ""} selected`
              : "Choose files"}
          </span>
          <Input
          id="media"
          type="file"
          accept={format === "video" ? "video/*" : "image/*"}
          multiple={format === "carousel"}
          className="hidden"
          {...register("media")}
          />
        </Label>
        {errors.media && (
          <p className="text-red-500 text-sm mt-1">
            {errors.media.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="primaryText">Primary Text</Label>
        <Textarea id="primaryText" {...register("primaryText")} />
        {errors.primaryText && (
          <p className="text-red-500 text-sm mt-1">
            {errors.primaryText.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" {...register("headline")} />
        {errors.headline && (
          <p className="text-red-500 text-sm mt-1">{errors.headline.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="callToAction">Call-to-Action</Label>
        <Controller
          name="callToAction"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a CTA" />
              </SelectTrigger>
              <SelectContent>
                {ctaOptions.map((cta) => (
                  <SelectItem key={cta} value={cta}>
                    {cta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.callToAction && (
          <p className="text-red-500 text-sm mt-1">
            {errors.callToAction.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="linkUrl">Landing Page URL</Label>
        <Input id="linkUrl" type="url" {...register("linkUrl")} />
        {errors.linkUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.linkUrl.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}
