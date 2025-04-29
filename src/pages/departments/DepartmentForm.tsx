import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Department } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Department name is required'),
})

type DepartmentFormData = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
  department?: Department | null
  setEditingDepartment: (arg: boolean) => void
}


export default function DepartmentForm({
  department,
  setIsModalOpen,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      departmentName: department?.departmentName|| '',
    },
  })

  console.log("Department",department)

  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/department/departments/", data),
    onSuccess:()=>{
      toast.success("Department added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/department/departments']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add department")
    },
  })


  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/department/departments/${department?._id}`, data),
    onSuccess: () => {
      toast.success('Department Update successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/departments'] });
      setIsModalOpen(false)
    },

    onError: () => {
      toast.error('Failed to update asset block');
    },
  })



  const onSubmit = async(data:Department)=>{
    // const payload = {
    //   departmentName: data?.departmentName || ''
    // }
    if(department){
      updateDataMutation.mutate(data)
    }else{
      createDataMutation.mutate(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="departmentName"
          className="block text-sm font-medium text-gray-700"
        >
          Department Name
        </label>
        <Input
          id="departmentName"
          {...register('departmentName')}
          className="mt-1"
          placeholder="e.g., IT Department"
        />
        {errors.departmentName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.departmentName.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Department</Button>
      </div>
    </form>
  )
}