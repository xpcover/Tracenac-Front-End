import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const shiftUsageSchema = z.object({
  asset_id: z.string().min(1, 'Asset is required'),
  date: z.string().min(1, 'Date is required'),
  shift: z.enum(['morning', 'afternoon', 'night']),
  usage_hours: z.number().min(0, 'Hours must be positive').max(24, 'Hours cannot exceed 24'),
  operator_id: z.string().min(1, 'Operator is required'),
  location_id: z.string().min(1, 'Location is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  notes: z.string(),
})

type ShiftUsageFormData = z.infer<typeof shiftUsageSchema>

interface ShiftUsageFormProps {
  usage?: {
    asset_id: string
    date: string
    shift: 'morning' | 'afternoon' | 'night'
    usage_hours: number
    operator_id: string
    location_id: string
    latitude: number
    longitude: number
    notes: string
  } | null
  onSubmit: (data: ShiftUsageFormData) => void
}

export default function ShiftUsageForm({ usage, onSubmit }: ShiftUsageFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShiftUsageFormData>({
    resolver: zodResolver(shiftUsageSchema),
    defaultValues: {
      asset_id: usage?.asset_id || '',
      date: usage?.date || '',
      shift: usage?.shift || 'morning',
      usage_hours: usage?.usage_hours || 0,
      operator_id: usage?.operator_id || '',
      location_id: usage?.location_id || '',
      latitude: usage?.latitude || 0,
      longitude: usage?.longitude || 0,
      notes: usage?.notes || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Asset</label>
          <Input {...register('asset_id')} className="mt-1" />
          {errors.asset_id && (
            <p className="mt-1 text-sm text-red-600">{errors.asset_id.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <Input type="date" {...register('date')} className="mt-1" />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Shift</label>
          <select
            {...register('shift')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="night">Night</option>
          </select>
          {errors.shift && (
            <p className="mt-1 text-sm text-red-600">{errors.shift.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usage Hours
          </label>
          <Input
            type="number"
            step="0.5"
            {...register('usage_hours', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.usage_hours && (
            <p className="mt-1 text-sm text-red-600">
              {errors.usage_hours.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Operator
          </label>
          <Input {...register('operator_id')} className="mt-1" />
          {errors.operator_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.operator_id.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <Input {...register('location_id')} className="mt-1" />
          {errors.location_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location_id.message}
            </p>
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
        <Button type="submit">Save Usage</Button>
      </div>
    </form>
  )
}