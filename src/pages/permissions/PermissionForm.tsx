import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Permission } from '@/lib/types'

const permissionSchema = z.object({
  permission_name: z.string().min(1, 'Permission name is required'),
  description: z.string().min(1, 'Description is required'),
})

type PermissionFormData = z.infer<typeof permissionSchema>

interface PermissionFormProps {
  permission?: Permission | null
  onSubmit: (data: PermissionFormData) => void
}

export default function PermissionForm({
  permission,
  onSubmit,
}: PermissionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermissionFormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      permission_name: permission?.permission_name || '',
      description: permission?.description || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="permission_name"
          className="block text-sm font-medium text-gray-700"
        >
          Permission Name
        </label>
        <Input
          id="permission_name"
          {...register('permission_name')}
          className="mt-1"
          placeholder="e.g., CREATE_ASSET"
        />
        {errors.permission_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.permission_name.message}
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
          placeholder="Describe what this permission allows"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Permission</Button>
      </div>
    </form>
  )
}