import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Plus, X } from 'lucide-react'
import Checkbox from '@/components/ui/CheckBox'
import { useMutation } from '@tanstack/react-query'
import ApiService from '@/services/api.service'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const subscriptionSchema = z.object({
  icon: z.string().url({ message: 'Icon URL must be valid' }),
  name: z.string().min(1, 'Name is required'),
  price_per_month: z.number().min(0, 'Monthly price is required'),
  price_per_year: z.number().min(0, 'Yearly price is required'),
  feature_included: z.array(z.string()).min(1, 'At least one feature is required')
    .refine(arr => arr.some(feature => feature.trim() !== ''), 'At least one non-empty feature is required'),
  max_users: z.number().min(1, 'Max users is required'),
  max_assets_tracked: z.number().min(1, 'Max assets is required'),
  qr_code_limit: z.number().min(0),
  blockchain_enabled: z.enum(['0', '1']),
  custom_domain: z.boolean(),
  support_level: z.string().min(1, 'Support level is required'),
  analytics_level: z.string().min(1, 'Analytics level is required'),
  noOfLocations: z.number().min(1),
  noOfAssets: z.number().min(1),
  validityDays: z.number().min(1),
})

type SubscriptionFormData = z.infer<typeof subscriptionSchema>

interface Props {
  data:SubscriptionFormData | null
  setIsModalOpen: (key: boolean) => void
}

const FieldGroup = ({ 
  title, 
  children, 
  cols = 3 
}: { 
  title: string
  children: React.ReactNode
  cols?: number 
}) => (
  <div className="space-y-2">
    <h3 className="text-sm font-semibold text-gray-800 border-b pb-1">{title}</h3>
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-3`}>
      {children}
    </div>
  </div>
)

export default function SubscriptionForm({ data, setIsModalOpen }: Props) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      icon: '',
      name: '',
      price_per_month: 0,
      price_per_year: 0,
      feature_included: [''],
      max_users: 1,
      max_assets_tracked: 1,
      qr_code_limit: 0,
      blockchain_enabled: '0',
      custom_domain: false,
      support_level: '',
      analytics_level: '',
      noOfLocations: 1,
      noOfAssets: 1,
      validityDays: 30,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'feature_included',
  })

  useEffect(()=> {},[])

  const createMutation = useMutation({
    mutationFn: (data: SubscriptionFormData) => ApiService.post('/tenant/create-subscription', data),
    onSuccess: () => {
      toast.success("Subscription created successfully!")
      setIsModalOpen(false)
    },
    onError: () => toast.error('Failed to create subscription')
  })
 
  const updateMutation = useMutation({
    mutationFn: (data: SubscriptionFormData) => ApiService.post('/tenant/create-subscription', data),
    onSuccess: () => {
      toast.success("Subscription updated successfully!")
      setIsModalOpen(false)
    },
    onError: () => toast.error('Failed to update subscription')
  })

  const onSubmit = (formData: SubscriptionFormData) => {
    if(data)
      updateMutation.mutate(formData)
    else
      createMutation.mutate(formData)
  }

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Information */}
        <FieldGroup title="Basic Information" cols={2}>
          <Input 
            label="Plan Name" 
            {...register('name')} 
            error={errors.name?.message} 
          />
          <Input 
            label="Icon URL" 
            {...register('icon')} 
            error={errors.icon?.message}
            placeholder="https://..."
          />
        </FieldGroup>

        {/* Pricing */}
        <FieldGroup title="Pricing" cols={2}>
          <Input 
            label="Monthly Price ($)" 
            type="number" 
            step="0.01"
            {...register('price_per_month', { valueAsNumber: true })} 
            error={errors.price_per_month?.message} 
          />
          <Input 
            label="Yearly Price ($)" 
            type="number" 
            step="0.01"
            {...register('price_per_year', { valueAsNumber: true })} 
            error={errors.price_per_year?.message} 
          />
        </FieldGroup>

        {/* Limits & Quotas */}
        <FieldGroup title="Limits & Quotas" cols={2}>
          <Input 
            label="Max Users" 
            type="number" 
            {...register('max_users', { valueAsNumber: true })} 
            error={errors.max_users?.message} 
          />
          <Input 
            label="Max Assets" 
            type="number" 
            {...register('max_assets_tracked', { valueAsNumber: true })} 
            error={errors.max_assets_tracked?.message} 
          />
          <Input 
            label="QR Code Limit" 
            type="number" 
            {...register('qr_code_limit', { valueAsNumber: true })} 
            error={errors.qr_code_limit?.message} 
          />
          <Input 
            label="Validity (Days)" 
            type="number" 
            {...register('validityDays', { valueAsNumber: true })} 
            error={errors.validityDays?.message} 
          />
        </FieldGroup>

        {/* Configuration */}
        <FieldGroup title="Configuration" cols={2}>
          <Input 
            label="Locations" 
            type="number" 
            {...register('noOfLocations', { valueAsNumber: true })} 
            error={errors.noOfLocations?.message} 
          />
          <Input 
            label="Assets" 
            type="number" 
            {...register('noOfAssets', { valueAsNumber: true })} 
            error={errors.noOfAssets?.message} 
          />
          <Input 
            label="Support Level" 
            {...register('support_level')} 
            error={errors.support_level?.message}
            placeholder="Basic, Premium, etc."
          />
          <Input 
            label="Analytics Level" 
            {...register('analytics_level')} 
            error={errors.analytics_level?.message}
            placeholder="Basic, Advanced, etc."
          />
        </FieldGroup>

        {/* Feature Toggles */}
        <FieldGroup title="Feature Toggles" cols={3}>
          <Controller
            control={control}
            name="custom_domain"
            render={({ field }) => (
              <Checkbox
                label="Custom Domain"
                checked={field.value}
                onChange={field.onChange}
                error={errors.custom_domain?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name="blockchain_enabled"
            render={({ field }) => (
              <Checkbox
                label="Blockchain Enabled"
                checked={field.value === '1'}
                onChange={(checked) => field.onChange(checked ? '1' : '0')}
                error={errors.blockchain_enabled?.message}
              />
            )}
          />
        </FieldGroup>

 {/* Features */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 border-b pb-1">Features Included</h3>
          <div className="space-y-2">
            {fields.length === 0 ? (
              <button
                type="button" 
                onClick={() => append('')}
                className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 w-full justify-center text-sm"
              >
                <Plus className="w-4 h-4 text-gray-500" />
                <span className="text-gray-500">Add first feature</span>
              </button>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      {...register(`feature_included.${index}`)}
                      error={errors.feature_included?.[index]?.message}
                      placeholder="Enter feature description"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex gap-1 pt-2">
                    {index === fields.length - 1 && (
                      <button
                        type="button"
                        onClick={() => append('')}
                        className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-600"
                        title="Add feature"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600"
                        title="Remove feature"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {errors.feature_included?.message && (
            <p className="text-red-500 text-xs">{errors.feature_included.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-8 py-2"
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Plan'}
          </Button>
        </div>
      </form>
  )
}