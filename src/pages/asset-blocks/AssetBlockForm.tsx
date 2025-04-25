import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { AssetBlock } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'
import { set } from 'date-fns'

const blockSchema = z.object({
  block_name: z.string().min(1, 'Block name is required'),
  description: z.string().min(1, 'Description is required'),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
})

type BlockFormData = z.infer<typeof blockSchema>

interface AssetBlockFormProps {
  block?: AssetBlock | null
  setEditingBlock: (arg: boolean) => void
}

export default function AssetBlockForm({
  block,
  setEditingBlock,
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

  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData('/assets/block', data),
    onSuccess: () => {
      toast.success('Asset Block added successfully');
      queryClient.invalidateQueries({ queryKey: ['/assets/block'] });
      setEditingBlock(false)
    },
    onError: () => {
      toast.error('Failed to add asset block');
    },
  })

  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/assets/block/${block?._id}`, data),
    onSuccess: () => {
      toast.success('Asset Block updated successfully');
      queryClient.invalidateQueries({ queryKey: ['/assets/block'] });
      setEditingBlock(false)
    },

    onError: () => {
      toast.error('Failed to update asset block');
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

  const onSubmit = async (data: BlockFormData) => {
    const payload = {
      blockName: data.block_name,
      description: data.description,
      location: {
        latitude: parseFloat(data.latitude || '0'),
        longitude: parseFloat(data.longitude || '0'),
      }
    }

    if(block) {
      updateDataMutation.mutate(payload)
    } else {
      createDataMutation.mutate(payload)
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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