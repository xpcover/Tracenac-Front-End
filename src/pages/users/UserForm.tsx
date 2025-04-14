import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { User } from '@/lib/types'

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  is_active: z.boolean(),
  userRole: z.string().min(1, 'User role is required'),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: User | null
  onSubmit: (data: UserFormData) => void
}

export default function UserForm({ user, onSubmit }: UserFormProps) {
  const [roles, setRoles] = useState<{ _id: string, name: string }[]>([])

  useEffect(() => {
    // Fetch roles from the API
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://api.tracenac.com/api/tenant/get-roles', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch roles')
        }

        const data = await response.json()
        setRoles(data.msg)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      is_active: user?.is_active ?? true,
      userRole: user?.userRole || '',
    },
  })

  const onSubmitForm = async (data: UserFormData) => {
    const { username, password, first_name, last_name, email, is_active, userRole } = data
    const userData = {
      name: `${first_name} ${last_name}`,
      email,
      phone: '1234567890', // Replace with actual phone field if available
      password,
      userRole,
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Failed to Add Employee')
      }

      alert('User added successfully')
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <Input id="username" {...register('username')} className="mt-1" />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {!user && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            className="mt-1"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <Input id="first_name" {...register('first_name')} className="mt-1" />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <Input id="last_name" {...register('last_name')} className="mt-1" />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input id="email" type="email" {...register('email')} className="mt-1" />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="userRole" className="block text-sm font-medium text-gray-700">
          User Role
        </label>
        <select
          id="userRole"
          {...register('userRole')}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role._id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.userRole && (
          <p className="mt-1 text-sm text-red-600">{errors.userRole.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save User</Button>
      </div>
    </form>
  )
}