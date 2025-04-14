import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const contractSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  contract_type: z.enum(['amc', 'insurance', 'warranty']),
  provider_name: z.string().min(1, 'Provider name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  cost: z.number().min(0, 'Cost must be positive'),
  terms: z.string().min(1, 'Terms are required'),
})

type ContractFormData = z.infer<typeof contractSchema>

interface ContractFormProps {
  contract?: {
    asset_id: string
    contract_type: 'amc' | 'insurance' | 'warranty'
    provider_name: string
    start_date: string
    end_date: string
    cost: number
    terms: string
  } | null
  onSubmit: (data: ContractFormData) => void
}

export default function ContractForm({ contract, onSubmit }: ContractFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      asset_id: contract?.asset_id || '',
      contract_type: contract?.contract_type || 'warranty',
      provider_name: contract?.provider_name || '',
      start_date: contract?.start_date || '',
      end_date: contract?.end_date || '',
      cost: contract?.cost || 0,
      terms: contract?.terms || '',
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
            Contract Type
          </label>
          <select
            {...register('contract_type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="warranty">Warranty</option>
            <option value="insurance">Insurance</option>
            <option value="amc">AMC</option>
          </select>
          {errors.contract_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.contract_type.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Provider Name
        </label>
        <Input {...register('provider_name')} className="mt-1" />
        {errors.provider_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.provider_name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <Input type="date" {...register('start_date')} className="mt-1" />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.start_date.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <Input type="date" {...register('end_date')} className="mt-1" />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cost</label>
        <Input
          type="number"
          step="0.01"
          {...register('cost', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.cost && (
          <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Terms</label>
        <textarea
          {...register('terms')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter contract terms and conditions"
        />
        {errors.terms && (
          <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Contract</Button>
      </div>
    </form>
  )
}