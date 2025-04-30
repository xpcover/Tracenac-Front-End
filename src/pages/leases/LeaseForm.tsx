import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const leaseSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  lessor_name: z.string().min(1, 'Lessor name is required'),
  lease_start: z.string().min(1, 'Start date is required'),
  lease_end: z.string().min(1, 'End date is required'),
  lease_terms: z.string().min(1, 'Terms are required'),
  lease_amount: z.number().min(0, 'Amount must be positive'),
})

type LeaseFormData = z.infer<typeof leaseSchema>

interface LeaseFormProps {
  lease?: {
    asset_id: string
    lessor_name: string
    lease_start: string
    lease_end: string
    lease_terms: string
    lease_amount: number
  } | null
  onSubmit: (data: LeaseFormData) => void
}

export default function LeaseForm({ lease, onSubmit }: LeaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      asset_id: lease?.asset_id || '',
      lessor_name: lease?.lessor_name || '',
      lease_start: lease?.lease_start || '',
      lease_end: lease?.lease_end || '',
      lease_terms: lease?.lease_terms || '',
      lease_amount: lease?.lease_amount || 0,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Asset ID
          </label>
          <Input {...register('asset_id')} className="mt-1" />
          {errors.asset_id && (
            <p className="mt-1 text-sm text-red-600">{errors.asset_id.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lessor Name
          </label>
          <Input {...register('lessor_name')} className="mt-1" />
          {errors.lessor_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lessor_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Input type="date" {...register('lease_start')} className="mt-1" />
          {errors.lease_start && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lease_start.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <Input type="date" {...register('lease_end')} className="mt-1" />
          {errors.lease_end && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lease_end.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lease Amount
        </label>
        <Input
          type="number"
          step="0.01"
          {...register('lease_amount', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.lease_amount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.lease_amount.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lease Terms
        </label>
        <textarea
          {...register('lease_terms')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter lease terms and conditions"
        />
        {errors.lease_terms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.lease_terms.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Lease</Button>
      </div>
    </form>
  )
}