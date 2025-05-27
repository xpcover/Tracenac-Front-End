import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const notificationSchema = z.object({
  user_id: z.string().min(1, 'User is required'),
  type: z.enum(['info', 'warning', 'critical']),
  message: z.string().min(1, 'Message is required'),
  due_date: z.string().nullable(),
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface NotificationFormProps {
  notification?: {
    user_id: string
    type: 'info' | 'warning' | 'critical'
    message: string
    due_date: string | null
  } | null
  onSubmit: (data: NotificationFormData) => void
}

export default function NotificationForm({
  notification,
  onSubmit,
}: NotificationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      user_id: notification?.user_id || '',
      type: notification?.type || 'info',
      message: notification?.message || '',
      due_date: notification?.due_date || null,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">User</label>
        <Input {...register('user_id')} className="mt-1" />
        {errors.user_id && (
          <p className="mt-1 text-sm text-red-600">{errors.user_id.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea
          {...register('message')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <Input type="date" {...register('due_date')} className="mt-1" />
        {errors.due_date && (
          <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Notification</Button>
      </div>
    </form>
  )
}