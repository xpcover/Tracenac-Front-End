import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CostCentre } from '@/lib/types'

const costCentreSchema = z.object({
  cost_centre_name: z.string().min(1, 'Cost centre name is required'),
  description: z.string().min(1, 'Description is required'),
})

type CostCentreFormData = z.infer<typeof costCentreSchema>

interface CostCentreFormProps {
  costCentre?: CostCentre | null
  onSubmit: (data: CostCentreFormData) => void
}

export default function CostCentreForm({
  costCentre,
  onSubmit,
}: CostCentreFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CostCentreFormData>({
    resolver: zodResolver(costCentreSchema),
    defaultValues: {
      cost_centre_name: costCentre?.cost_centre_name || '',
      description: costCentre?.description || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="cost_centre_name"
          className="block text-sm font-medium text-gray-700"
        >
          Cost Centre Name
        </label>
        <Input
          id="cost_centre_name"
          {...register('cost_centre_name')}
          className="mt-1"
          placeholder="e.g., IT Operations"
        />
        {errors.cost_centre_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.cost_centre_name.message}
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

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Cost Centre</Button>
      </div>
    </form>
  )
}