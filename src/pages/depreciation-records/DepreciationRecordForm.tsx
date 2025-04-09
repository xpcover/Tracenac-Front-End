import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const depreciationRecordSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  component_id: z.string().nullable(),
  fiscal_year: z.string().min(1, 'Fiscal year is required'),
  period_start_date: z.string().min(1, 'Period start date is required'),
  period_end_date: z.string().min(1, 'Period end date is required'),
  depreciation_amount: z.number().min(0, 'Amount must be positive'),
  book_type: z.enum(['tax', 'financial']),
  method: z.string().min(1, 'Method is required'),
  rate: z.number().min(0, 'Rate must be positive'),
  notes: z.string(),
})

type DepreciationRecordFormData = z.infer<typeof depreciationRecordSchema>

interface DepreciationRecordFormProps {
  record?: {
    asset_id: string
    component_id: string | null
    fiscal_year: string
    period_start_date: string
    period_end_date: string
    depreciation_amount: number
    book_type: 'tax' | 'financial'
    method: string
    rate: number
    notes: string
  } | null
  onSubmit: (data: DepreciationRecordFormData) => void
}

const DEPRECIATION_METHODS = [
  'straight-line',
  'declining-balance',
  'sum-of-years',
  'units-of-production',
]

export default function DepreciationRecordForm({
  record,
  onSubmit,
}: DepreciationRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepreciationRecordFormData>({
    resolver: zodResolver(depreciationRecordSchema),
    defaultValues: {
      asset_id: record?.asset_id || '',
      component_id: record?.component_id || null,
      fiscal_year: record?.fiscal_year || new Date().getFullYear().toString(),
      period_start_date: record?.period_start_date || '',
      period_end_date: record?.period_end_date || '',
      depreciation_amount: record?.depreciation_amount || 0,
      book_type: record?.book_type || 'financial',
      method: record?.method || 'straight-line',
      rate: record?.rate || 0,
      notes: record?.notes || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            Component ID (Optional)
          </label>
          <Input {...register('component_id')} className="mt-1" />
          {errors.component_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.component_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fiscal Year
          </label>
          <Input {...register('fiscal_year')} className="mt-1" />
          {errors.fiscal_year && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fiscal_year.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Period Start
          </label>
          <Input type="date" {...register('period_start_date')} className="mt-1" />
          {errors.period_start_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.period_start_date.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Period End
          </label>
          <Input type="date" {...register('period_end_date')} className="mt-1" />
          {errors.period_end_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.period_end_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Depreciation Amount
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('depreciation_amount', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.depreciation_amount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.depreciation_amount.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Book Type
          </label>
          <select
            {...register('book_type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="financial">Financial</option>
            <option value="tax">Tax</option>
          </select>
          {errors.book_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.book_type.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Depreciation Method
          </label>
          <select
            {...register('method')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {DEPRECIATION_METHODS.map((method) => (
              <option key={method} value={method}>
                {method
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </option>
            ))}
          </select>
          {errors.method && (
            <p className="mt-1 text-sm text-red-600">{errors.method.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rate (%)
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('rate', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.rate && (
            <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Record</Button>
      </div>
    </form>
  )
}