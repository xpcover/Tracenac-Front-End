import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { AssetBlock } from '@/lib/types'

const blockSchema = z.object({
  block_name: z.string().min(1, 'Block name is required'),
  description: z.string().min(1, 'Description is required'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type BlockFormData = z.infer<typeof blockSchema>

interface AssetBlockFormProps {
  block?: AssetBlock | null
  onSubmit: (data: BlockFormData) => void
}

export default function AssetBlockForm({
  block,
  onSubmit,
}: AssetBlockFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BlockFormData>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      block_name: block?.block_name || '',
      description: block?.description || '',
      latitude: block?.latitude || '',
      longitude: block?.longitude || '',
    },
  })

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toString())
          setValue('longitude', position.coords.longitude.toString())
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleFormSubmit = async (data: BlockFormData) => {
    const payload = {
      blockName: data.block_name,
      description: data.description,
      location: {
        latitude: parseFloat(data.latitude || '0'),
        longitude: parseFloat(data.longitude || '0'),
      },
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/assets/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to submit block data')
      }

      const result = await response.json()
      console.log('Block submission successful:', result)
      onSubmit(data)
    } catch (error) {
      console.error('Error submitting block data:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="block_name"
          className="block text-sm font-medium text-gray-700"
        >
          Block Name
        </label>
        <Input
          id="block_name"
          {...register('block_name')}
          className="mt-1"
          placeholder="e.g., Block A"
        />
        {errors.block_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.block_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe this asset block"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="latitude"
          className="block text-sm font-medium text-gray-700"
        >
          Latitude
        </label>
        <Input
          id="latitude"
          {...register('latitude')}
          className="mt-1"
          placeholder="Latitude"
        />
        {errors.latitude && (
          <p className="mt-1 text-sm text-red-600">
            {errors.latitude.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="longitude"
          className="block text-sm font-medium text-gray-700"
        >
          Longitude
        </label>
        <Input
          id="longitude"
          {...register('longitude')}
          className="mt-1"
          placeholder="Longitude"
        />
        {errors.longitude && (
          <p className="mt-1 text-sm text-red-600">
            {errors.longitude.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={handleGetLocation}>
          Get Location
        </Button>
        <Button type="submit">Save Block</Button>
      </div>
    </form>
  )
}