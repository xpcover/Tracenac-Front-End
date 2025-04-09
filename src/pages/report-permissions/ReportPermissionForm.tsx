import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const permissionSchema = z.object({
  report_id: z.string().min(1, 'Report ID is required'),
  role_id: z.string().min(1, 'Role ID is required'),
  permission: z.enum(['view', 'edit', 'approve']),
})

type PermissionFormData = z.infer<typeof permissionSchema>

interface ReportPermissionFormProps {
  permission?: {
    report_id: string
    role_id: string
    permission: 'view' | 'edit' | 'approve'
  } | null
  onSubmit: (data: PermissionFormData) => void
}

export default function ReportPermissionForm({
  permission,
  onSubmit,
}: ReportPermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      report_id: permission?.report_id || '',
      role_id: permission?.role_id || '',
      permission: permission?.permission || 'view',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Report ID
        </label>
        <Input {...register('report_id')} className="mt-1" />
        {errors.report_id && (
          <p className="mt-1 text-sm text-red-600">{errors.report_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role ID</label>
        <Input {...register('role_id')} className="mt-1" />
        {errors.role_id && (
          <p className="mt-1 text-sm text-red-600">{errors.role_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Permission Level
        </label>
        <select
          {...register('permission')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="view">View Only</option>
          <option value="edit">Edit</option>
          <option value="approve">Approve</option>
        </select>
        {errors.permission && (
          <p className="mt-1 text-sm text-red-600">
            {errors.permission.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Permission</Button>
      </div>
    </form>
  )
}