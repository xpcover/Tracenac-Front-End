import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Budget } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const budgetSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  fiscal_year: z.string().min(1, 'Fiscal year is required'),
  budget_amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Budget amount must be positive')
  ),  
  actual_amount: z.preprocess(
    (val) => Number(val),
    z.number().min(0, 'Actual amount must be positive')
  ),
  createdBy: z.string().min(1, 'CreatedBy is required'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetFormProps {
  budget?: Budget | null
  setIsModalOpen: (arg: boolean) => void
}

export default function BudgetForm({ budget, setIsModalOpen }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      assetId: budget?.assetId || '',
      fiscal_year: budget?.fiscal_year || new Date().getFullYear().toString(),
      budget_amount: budget?.budget_amount || 0, // convert number to string
      actual_amount: budget?.actual_amount || 0, // convert number to string
      createdBy: budget?.createdBy || localStorage.getItem('userId') || '',
    },
  })

  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/department/budget/", data),
    onSuccess:()=>{
      toast.success("Budget added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/department/budget']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add department")
    },
  })


  const updateDataMutation = useMutation({
    mutationFn: data =>  dataTableService.updateData(`/department/budget/${budget?._id}`, data),
    onSuccess: () => {
      toast.success('Department Update successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/departments'] });
      setIsModalOpen(false)
    },

    onError: () => {
      toast.error('Failed to update asset block');
    },
  })



  const onSubmit = async(data:Budget)=>{
    if(budget){
      updateDataMutation.mutate(data)
    }else{
      createDataMutation.mutate(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Asset ID
          </label>
          <Input {...register('assetId')} className="mt-1" />
          {errors.assetId && (
            <p className="mt-1 text-sm text-red-600">{errors.assetId.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fiscal Year
          </label>
          <Input {...register('fiscal_year')} className="mt-1" />
          {errors.fiscal_year && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fiscal_year.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget Amount
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('budget_amount', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.budget_amount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.budget_amount.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Actual Amount
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('actual_amount', { valueAsNumber: true })}
            className="mt-1"
          />
          {errors.actual_amount && (
            <p className="mt-1 text-sm text-red-600">
              {errors.actual_amount.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Budget</Button>
      </div>
    </form>
  )
}