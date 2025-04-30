import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const labelSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  label_type: z.enum(['qr', 'barcode', 'rfid']),
  label_data: z.string().min(1, 'Label data is required'),
})

type LabelFormData = z.infer<typeof labelSchema>

interface AssetLabelFormProps {
  label?: {
    asset_id: string
    label_type: 'qr' | 'barcode' | 'rfid'
    label_data: string
  } | null
  onSubmit: (data: LabelFormData) => void
}

export default function AssetLabelForm({ label, onSubmit }: AssetLabelFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LabelFormData>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      asset_id: label?.asset_id || '',
      label_type: label?.label_type || 'qr',
      label_data: label?.label_data || '',
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
          Label Type
        </label>
        <select
          {...register('label_type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="qr">QR Code</option>
          <option value="barcode">Barcode</option>
          <option value="rfid">RFID</option>
        </select>
        {errors.label_type && (
          <p className="mt-1 text-sm text-red-600">
            {errors.label_type.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Label Data
        </label>
        <Input {...register('label_data')} className="mt-1 font-mono" />
        {errors.label_data && (
          <p className="mt-1 text-sm text-red-600">
            {errors.label_data.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Label</Button>
      </div>
    </form>
  )
}