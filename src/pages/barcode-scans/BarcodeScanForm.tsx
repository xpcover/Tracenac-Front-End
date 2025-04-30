import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const scanSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  barcode_data: z.string().min(1, 'Barcode data is required'),
  scan_date: z.string().min(1, 'Scan date is required'),
  scanned_by: z.string().min(1, 'Scanner ID is required'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  location_id: z.string().nullable(),
  address: z.string().nullable(),
  verification_status: z.enum(['verified', 'unverified', 'failed']),
  notes: z.string(),
})

type ScanFormData = z.infer<typeof scanSchema>

interface BarcodeScanFormProps {
  scan?: {
    asset_id: string
    barcode_data: string
    scan_date: string
    scanned_by: string
    latitude: number | null
    longitude: number | null
    location_id: string | null
    address: string | null
    verification_status: 'verified' | 'unverified' | 'failed'
    notes: string
  } | null
  onSubmit: (data: ScanFormData) => void
}

export default function BarcodeScanForm({ scan, onSubmit }: BarcodeScanFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScanFormData>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      asset_id: scan?.asset_id || '',
      barcode_data: scan?.barcode_data || '',
      scan_date: scan?.scan_date ? new Date(scan.scan_date).toISOString().split('T')[0] : '',
      scanned_by: scan?.scanned_by || '',
      latitude: scan?.latitude || null,
      longitude: scan?.longitude || null,
      location_id: scan?.location_id || null,
      address: scan?.address || null,
      verification_status: scan?.verification_status || 'unverified',
      notes: scan?.notes || '',
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
            Barcode Data
          </label>
          <Input {...register('barcode_data')} className="mt-1 font-mono" />
          {errors.barcode_data && (
            <p className="mt-1 text-sm text-red-600">
              {errors.barcode_data.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scan Date
          </label>
          <Input type="datetime-local" {...register('scan_date')} className="mt-1" />
          {errors.scan_date && (
            <p className="mt-1 text-sm text-red-600">
              {errors.scan_date.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Scanned By
          </label>
          <Input {...register('scanned_by')} className="mt-1" />
          {errors.scanned_by && (
            <p className="mt-1 text-sm text-red-600">
              {errors.scanned_by.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location ID
          </label>
          <Input {...register('location_id')} className="mt-1" />
          {errors.location_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location_id.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Status
          </label>
          <select
            {...register('verification_status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="unverified">Unverified</option>
            <option value="verified">Verified</option>
            <option value="failed">Failed</option>
          </select>
          {errors.verification_status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.verification_status.message}
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
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <Input {...register('address')} className="mt-1" />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
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
        <Button type="submit">Save Scan</Button>
      </div>
    </form>
  )
}