import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Role } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleFormProps {
  role?: Role | null
  setIsModalOpen: (arg: boolean) => void
}

export default function RoleForm({ role, setIsModalOpen }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
    },
  })

  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/tenant/roles/", data),
    onSuccess:()=>{
      toast.success("Role added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/tenant/roles']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add Role")
    },
  })


  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/tenant/role-edit/${role?._id}`, data),
    onSuccess: () => {
      toast.success('Department Update successfully');
      queryClient.invalidateQueries({ queryKey: ['/tenant/role-edit'] });
      setIsModalOpen(false)
    },

    onError: () => {
      toast.error('Failed to update asset block');
    },
  })



  const onSubmit = async(data:Role)=>{
    if(role){
      updateDataMutation.mutate(data)
    }else{
      createDataMutation.mutate(data)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <Input id="name" {...register('name')} className="mt-1" />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Role</Button>
      </div>
    </form>
  )
}