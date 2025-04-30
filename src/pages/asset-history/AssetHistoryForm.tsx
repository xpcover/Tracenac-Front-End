import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const historySchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  change_date: z.string().min(1, 'Change date is required'),
  change_type: z.enum(['location', 'status', 'maintenance', 'transfer']),
  details: z.string().min(1, 'Details are required'),
  changed_by: z.string().min(1, 'Changed by is required'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
})

type HistoryFormData = z.infer<typeof historySchema>

interface AssetHistoryFormProps {
  history?: {
    asset_id: string
    change_date: string
    change_type: 'location' | 'status' | 'maintenance' | 'transfer'
    details: string
    changed_by: string
    latitude: number | null
    longitude: number | null
    address: string | null
  } | null
  onSubmit: (data: HistoryFormData) => void
}

export default function AssetHistoryForm({
  history,
  onSubmit,
}: AssetHistoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<HistoryFormData>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      asset_id: history?.asset_id || '',
      change_date: history?.change_date ? new Date(history.change_date).toISOString().split('T')[0] : '',
      change_type: history?.change_type || 'status',
      details: history?.details || '',
      changed_by: history?.changed_by || '',
      latitude: history?.latitude || null,
      longitude: history?.longitude || null,
      address: history?.address || null,
    },
  })

  const changeType = watch('change_type')
  const showLocationFields = changeType === 'location'

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
            Change Date
          </label>
          <Input type="date" {...register('change_date')} className="mt-1" />
          {errors.change_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.change_date.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Change Type
          </label>
          <select
            {...register('change_type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="location">Location Change</option>
            <option value="status">Status Change</option>
            <option value="maintenance">Maintenance</option>
            <option value="transfer">Transfer</option>
          </select>
          {errors.change_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.change_type.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Changed By
          </label>
          <Input {...register('changed_by')} className="mt-1" />
          {errors.changed_by && (
            <p className="mt-1 text-sm text-red-600">
              {errors.changed_by.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Details</label>
        <textarea
          {...register('details')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.details && (
          <p className="mt-1 text-sm text-red-600">{errors.details.message}</p>
        )}
      </div>

      {showLocationFields && (
        <>
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
                <p className="mt-1 text-sm text-red-600">
                  {errors.latitude.message}
                </p>
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
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <Input {...register('address')} className="mt-1" />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.address.message}
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit">Save History</Button>
      </div>
    </form>
  )
}