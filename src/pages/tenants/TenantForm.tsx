import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Tenant } from '@/lib/types'

const tenantSchema = z.object({
  tenant_name: z.string().min(1, 'Tenant name is required'),
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
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      tenant_name: tenant?.tenant_name || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="tenant_name"
          className="block text-sm font-medium text-gray-700"
        >
          Tenant Name
        </label>
        <Input
          id="tenant_name"
          {...register('tenant_name')}
          className="mt-1"
        />
        {errors.tenant_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tenant_name.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Tenant</Button>
      </div>
    </form>
  )
}