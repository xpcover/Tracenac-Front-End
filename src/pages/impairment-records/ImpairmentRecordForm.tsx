import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const impairmentSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  impairment_date: z.string().min(1, 'Date is required'),
  impairment_amount: z.number().min(0, 'Amount must be positive'),
  reason: z.string().min(1, 'Reason is required'),
  recorded_by: z.string().min(1, 'Recorder is required'),
})

type ImpairmentFormData = z.infer<typeof impairmentSchema>

interface ImpairmentRecordFormProps {
  record?: {
    asset_id: string
    impairment_date: string
    impairment_amount: number
    reason: string
    recorded_by: string
  } | null
  onSubmit: (data: ImpairmentFormData) => void
}

export default function ImpairmentRecordForm({
  record,
  onSubmit,
}: ImpairmentRecordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImpairmentFormData>({
    resolver: zodResolver(impairmentSchema),
    defaultValues: {
      asset_id: record?.asset_id || '',
      impairment_date: record?.impairment_date || '',
      impairment_amount: record?.impairment_amount || 0,
      reason: record?.reason || '',
      recorded_by: record?.recorded_by || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          Impairment Date
        </label>
        <Input type="date" {...register('impairment_date')} className="mt-1" />
        {errors.impairment_date && (
          <p className="mt-1 text-sm text-red-600">
            {errors.impairment_date.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Impairment Amount
        </label>
        <Input
          type="number"
          step="0.01"
          {...register('impairment_amount', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.impairment_amount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.impairment_amount.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <textarea
          {...register('reason')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.reason && (
          <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recorded By
        </label>
        <Input {...register('recorded_by')} className="mt-1" />
        {errors.recorded_by && (
          <p className="mt-1 text-sm text-red-600">
            {errors.recorded_by.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Record</Button>
      </div>
    </form>
  )
}