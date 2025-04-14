import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Role } from '@/lib/types'

const roleSchema = z.object({
  role_name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Description is required'),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleFormProps {
  role?: Role | null
  onSubmit: (data: RoleFormData) => void
}

export default function RoleForm({ role, onSubmit }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role_name: role?.role_name || '',
      description: role?.description || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="role_name" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <Input id="role_name" {...register('role_name')} className="mt-1" />
        {errors.role_name && (
          <p className="mt-1 text-sm text-red-600">{errors.role_name.message}</p>
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