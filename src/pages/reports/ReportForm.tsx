import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const reportSchema = z.object({
  report_name: z.string().min(1, 'Report name is required'),
  report_type: z.enum(['asset', 'depreciation', 'maintenance', 'usage']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  parameters: z.string(),
})

type ReportFormData = z.infer<typeof reportSchema>

interface ReportFormProps {
  report?: {
    report_name: string
    report_type: 'asset' | 'depreciation' | 'maintenance' | 'usage'
    parameters: string
  } | null
  onSubmit: (data: ReportFormData) => void
}

export default function ReportForm({ report, onSubmit }: ReportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      report_name: report?.report_name || '',
      report_type: report?.report_type || 'asset',
      start_date: '',
      end_date: '',
      parameters: report?.parameters || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Name
        </label>
        <Input {...register('report_name')} className="mt-1" />
        {errors.report_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.report_name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report Type
        </label>
        <select
          {...register('report_type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="asset">Asset Report</option>
          <option value="depreciation">Depreciation Report</option>
          <option value="maintenance">Maintenance Report</option>
          <option value="usage">Usage Report</option>
        </select>
        {errors.report_type && (
          <p className="mt-1 text-sm text-red-600">
            {errors.report_type.message}
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
        <label className="block text-sm font-medium text-gray-700">
          Additional Parameters
        </label>
        <textarea
          {...register('parameters')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter JSON parameters"
        />
        {errors.parameters && (
          <p className="mt-1 text-sm text-red-600">
            {errors.parameters.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Generate Report</Button>
      </div>
    </form>
  )
}