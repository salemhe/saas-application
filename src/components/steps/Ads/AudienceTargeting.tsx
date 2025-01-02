'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCampaignContext } from '@/context/CampaignFormContext'

const schema = z.object({
  location: z.string().min(1, 'Location is required'),
  ageMin: z.number().min(13, 'Minimum age is 13').max(65, 'Maximum age is 65'),
  ageMax: z.number().min(13, 'Minimum age is 13').max(65, 'Maximum age is 65'),
  gender: z.enum(['all', 'male', 'female'], {
    required_error: "Please select a gender option",
  }),
  interests: z.string().optional(),
  customAudience: z.string().optional(),
  lookalikeAudience: z.string().optional(),
})

type AudienceTargetingProps = {
  onNext: (data: z.infer<typeof schema>) => void
}

export default function AudienceTargeting({ onNext }: AudienceTargetingProps) {
  const { campaignData } = useCampaignContext()
  const { control, register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      location: campaignData.location,
      ageMin: campaignData.ageMin,
      ageMax: campaignData.ageMax,
      gender: campaignData.gender,
      interests: campaignData.interests,
      customAudience: campaignData.customAudience,
      lookalikeAudience: campaignData.lookalikeAudience,
    },
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ageMin">Minimum Age</Label>
          <Input id="ageMin" type="number" {...register('ageMin', { valueAsNumber: true })} />
          {errors.ageMin && <p className="text-red-500 text-sm mt-1">{errors.ageMin.message}</p>}
        </div>
        <div>
          <Label htmlFor="ageMax">Maximum Age</Label>
          <Input id="ageMax" type="number" {...register('ageMax', { valueAsNumber: true })} />
          {errors.ageMax && <p className="text-red-500 text-sm mt-1">{errors.ageMax.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
      </div>

      <div>
        <Label htmlFor="interests">Interests (Optional)</Label>
        <Input id="interests" {...register('interests')} />
        <p className="text-sm text-gray-500 mt-1">Adding interests can help narrow your audience.</p>
      </div>

      <div>
        <Label htmlFor="customAudience">Custom Audience (Optional)</Label>
        <Input id="customAudience" {...register('customAudience')} />
      </div>

      <div>
        <Label htmlFor="lookalikeAudience">Lookalike Audience (Optional)</Label>
        <Input id="lookalikeAudience" {...register('lookalikeAudience')} />
      </div>

      <Button type="submit" className="w-full">Next</Button>
    </form>
  )
}

