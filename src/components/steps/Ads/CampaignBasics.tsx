'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useCampaignContext } from '@/context/CampaignFormContext'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const schema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  budgetType: z.enum(['daily', 'lifetime'], {
    required_error: "Please select a budget type",
  }),
  budgetAmount: z.number().min(1, 'Budget amount is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type CampaignBasicsProps = {
  onNext: (data: z.infer<typeof schema>) => void
}

export default function CampaignBasics({ onNext }: CampaignBasicsProps) {
  const { campaignData, updateCampaignData } = useCampaignContext()
  const { control, register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      campaignName: campaignData.campaignName,
      budgetType: campaignData.budgetType,
      budgetAmount: campaignData.budgetAmount,
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
    },
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCampaignData(data)
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="campaignName">Campaign Name</Label>
        <Input id="campaignName" {...register('campaignName')} />
        {errors.campaignName && <p className="text-red-500 text-sm mt-1">{errors.campaignName.message}</p>}
      </div>

      <div>
        <h3 className="text-lg font-medium">Budget</h3>
        <Controller
          name="budgetType"
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="mt-2">
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
              <RadioGroupItem value="lifetime" id="lifetime" />
                <Label htmlFor="lifetime">Lifetime</Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.budgetType && <p className="text-red-500 text-sm mt-1">{errors.budgetType.message}</p>}
        
        <div className="mt-2">
          <Label htmlFor="budgetAmount">Budget Amount</Label>
          <Input id="budgetAmount" type="number" {...register('budgetAmount', { valueAsNumber: true })} />
          {errors.budgetAmount && <p className="text-red-500 text-sm mt-1">{errors.budgetAmount.message}</p>}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Schedule (Optional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" {...register('startDate')} />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" {...register('endDate')} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-1">Setting a schedule is optional but can help optimize your campaign.</p>
      </div>

      <Button type="submit" className="w-full">Next</Button>
    </form>
  )
}

