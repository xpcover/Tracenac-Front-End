import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const wipAssetSchema = z.object({
  asset_name: z.string().min(1, 'Asset name is required'),
  project_name: z.string().min(1, 'Project name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  expected_completion_date: z.string().min(1, 'Expected completion date is required'),
  accumulated_cost: z.number().min(0, 'Cost must be positive'),
  status: z.enum(['planning', 'in-progress', 'completed', 'cancelled']),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
})

type WipAssetFormData = z.infer<typeof wipAssetSchema>

interface WipAssetFormProps {
  asset?: {
    asset_name: string
    project_name: string
    start_date: string
    expected_completion_date: string
    accumulated_cost: number
    status: 'planning' | 'in-progress' | 'completed' | 'cancelled'
    latitude: number | null
    longitude: number | null
    address: string | null
  } | null
  onSubmit: (data: WipAssetFormData) => void
}

export default function WipAssetForm({ asset, onSubmit }: WipAssetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WipAssetFormData>({
    resolver: zodResolver(wipAssetSchema),
    defaultValues: {
      asset_name: asset?.asset_name || '',
      project_name: asset?.project_name || '',
      start_date: asset?.start_date || '',
      expected_completion_date: asset?.expected_completion_date || '',
      accumulated_cost: asset?.accumulated_cost || 0,
      status: asset?.status || 'planning',
      latitude: asset?.latitude || null,
      longitude: asset?.longitude || null,
      address: asset?.address || null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Asset Name
          </label>
          <Input {...register('asset_name')} className="mt-1" />
          {errors.asset_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.asset_name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Name
          </label>
          <Input {...register('project_name')} className="mt-1" />
          {errors.project_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.project_name.message}
            </p>
          )}
        </div>
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
            Expected Completion
          </label>
          <Input
            type="date"
            {...register('expected_completion_date')}
            className="mt-1"
          />
          {errors.expected_completion_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.expected_completion_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Accumulated Cost
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('accumulated_cost', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.accumulated_cost && (
            <p className="mt-1 text-sm text-red-600">
              {errors.accumulated_cost.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <Input
            type="number"
            step="any"
            {...register('latitude', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <Input
            type="number"
            step="any"
            {...register('longitude', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-600">
              {errors.longitude.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <Input {...register('address')} className="mt-1" />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save WIP Asset</Button>
      </div>
    </form>
  )
}