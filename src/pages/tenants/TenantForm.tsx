import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Subscription, Tenant } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'
import ApiService from '@/services/api.service'
import CustomSelect from '@/components/ui/CustomSelect'

const tenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required'),
  country: z.string().min(1, 'Tenant country is required'),
  subscriptionId: z.string().min(1, 'Tenant subscription is required'),
  email: z.string().min(1, 'Tenant email is required'),
  password: z.string().min(1, 'Tenant password is required'),
})

type TenantFormData = z.infer<typeof tenantSchema>

interface TenantFormProps {
  tenant?: Tenant | null
  onSubmit: (data: TenantFormData) => void
}

export default function TenantForm({ tenant, onSubmit }: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: tenant?.name || '',
      email: tenant?.email || '',
      subscriptionId: tenant?.subscriptionId || '',
      country: tenant?.country || '',
      password: tenant?.password || '',
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => ApiService.get('/tenant/get-subscriptions'),
  })

  const subscriptionOptions = (data || []).map((sub: Subscription) => ({
    label: sub.name,
    value: sub._id,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label='Tenant Name'
        id="name"
        {...register('name')}
        error={errors?.name?.message}
      />

      <Input
        label='Tenant Country'
        id='country'
        {...register('country')}
        error={errors?.country?.message}
      />

        <Controller
          control={control}
          name="subscriptionId"
          render={({ field }) => (
            <CustomSelect
              label='Tenant Subscription'
              {...field}
              options={subscriptionOptions}
              isLoading={isLoading}
              placeholder="Select a subscription"
              error={errors.subscriptionId ? errors.subscriptionId.message : ''}
            />
          )}
        />

      <Input
        label='Tenant Email'
        id='email'
        {...register('email')}
        error={errors?.email?.message}
      />
      
      <Input
        label='Tenant Password'
        id='password'
        {...register('password')}
        error={errors?.password?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Tenant</Button>
      </div>
    </form>
  )
}
