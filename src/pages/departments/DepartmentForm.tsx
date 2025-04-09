import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Department } from '@/lib/types'

const departmentSchema = z.object({
  department_name: z.string().min(1, 'Department name is required'),
})

type DepartmentFormData = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
  department?: Department | null
  onSubmit: (data: DepartmentFormData) => void
}

export default function DepartmentForm({
  department,
  onSubmit,
}: DepartmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      department_name: department?.department_name || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="department_name"
          className="block text-sm font-medium text-gray-700"
        >
          Department Name
        </label>
        <Input
          id="department_name"
          {...register('department_name')}
          className="mt-1"
          placeholder="e.g., IT Department"
        />
        {errors.department_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.department_name.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Department</Button>
      </div>
    </form>
  )
}