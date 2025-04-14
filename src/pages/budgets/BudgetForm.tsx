import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const budgetSchema = z.object({
  asset_id: z.string().min(1, 'Asset ID is required'),
  fiscal_year: z.string().min(1, 'Fiscal year is required'),
  budget_amount: z.number().min(0, 'Budget amount must be positive'),
  actual_amount: z.number().min(0, 'Actual amount must be positive'),
})

type BudgetFormData = z.infer<typeof budgetSchema>

interface BudgetFormProps {
  budget?: {
    asset_id: string
    fiscal_year: string
    budget_amount: number
    actual_amount: number
  } | null
  onSubmit: (data: BudgetFormData) => void
}

export default function BudgetForm({ budget, onSubmit }: BudgetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      asset_id: budget?.asset_id || '',
      fiscal_year: budget?.fiscal_year || new Date().getFullYear().toString(),
      budget_amount: budget?.budget_amount || 0,
      actual_amount: budget?.actual_amount || 0,
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