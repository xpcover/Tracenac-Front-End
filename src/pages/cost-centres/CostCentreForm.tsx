import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CostCentre } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const costCentreSchema = z.object({
  costCentreName: z.string().min(1, 'Cost centre name is required'),
  description: z.string().min(1, 'Description is required'),
})

type CostCentreFormData = z.infer<typeof costCentreSchema>

interface CostCentreFormProps {
  costCentre?: CostCentre | null
  viewCostCentre?: CostCentre | null
  setIsModalOpen: (arg: boolean) => void
}

export default function CostCentreForm({
  costCentre,
  viewCostCentre,
  setIsModalOpen,
}: CostCentreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CostCentreFormData>({
    resolver: zodResolver(costCentreSchema),
    defaultValues: {
      costCentreName: costCentre?.costCentreName || viewCostCentre?.costCentreName ||'',
      description: costCentre?.description || viewCostCentre?.description ||'',
    },
  })

  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/department/cost-center/", data),
    onSuccess:()=>{
      toast.success("Cost Center added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/department/cost-center']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add department")
    },
  })

  console.log("CostCenter", costCentre)
  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/department/cost-center/${costCentre?._id}`, data),
    onSuccess: () => {
      toast.success('Cost Center Update successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/cost-center'] });
      setIsModalOpen(false)
    },

    onError: () => {
      toast.error('Failed to update CostCenter');
    },
  })


    const onSubmit = async(data:CostCentre)=>{
      if(costCentre){
        console.log(data)
        updateDataMutation.mutate(data)
      }else{
        createDataMutation.mutate(data)
      }
    }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="costCentreName"
          className="block text-sm font-medium text-gray-700"
        >
          Cost Centre Name
        </label>
        <Input
          id="costCentreName"
          {...register('costCentreName')}
          className="mt-1"
          placeholder="e.g., IT Operations"
        />
        {errors.costCentreName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.costCentreName.message}
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
          placeholder="Describe this cost centre"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
      {!viewCostCentre && (
          <div className="flex justify-end gap-2">
              <Button type="submit">Save Cost Centre</Button>
        </div>
      )}
    </form>
  )
}