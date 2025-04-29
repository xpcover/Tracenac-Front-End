import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Location } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const locationSchema = z.object({
  location_name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

type LocationFormData = z.infer<typeof locationSchema>

interface LocationFormProps {
  location?: Location | null
  setIsModalOpen: (arg: boolean) => void
}

export default function LocationForm({
  location,
  setIsModalOpen,
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location_name: location?.location_name || '',
      address: location?.address || '',
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    },
  })

  const queryClient = useQueryClient();

  console.log("Location",location)

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/department/location/", data),
    onSuccess:()=>{
      toast.success("Location added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/department/location']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add Location")
    },
  })


  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/department/location/${location?._id}`, data),
    onSuccess: () => {
      toast.success('Location Update successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/location'] });
      setIsModalOpen(false)
    },

    onError: () => {
      toast.error('Failed to update Location');
    },
  })


  
  const onSubmit = async(data:Location)=>{
      if(location){
        updateDataMutation.mutate(data)
      }else{
        createDataMutation.mutate(data)
      }
  }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="location_name"
          className="block text-sm font-medium text-gray-700"
        >
          Location Name
        </label>
        <Input
          id="location_name"
          {...register('location_name')}
          className="mt-1"
          placeholder="e.g., Main Office"
        />
        {errors.location_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.location_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <textarea
          id="address"
          {...register('address')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Full address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <Input
            id="latitude"
            type="number"
            step="any"
            {...register('latitude', { valueAsNumber: true })}
            className="mt-1"
            placeholder="e.g., 40.7128"
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
            type="number"
            step="any"
            {...register('longitude', { valueAsNumber: true })}
            className="mt-1"
            placeholder="e.g., -74.0060"
          />
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-600">
              {errors.longitude.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Location</Button>
      </div>
    </form>
  )
}