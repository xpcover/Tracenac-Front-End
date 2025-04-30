import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { User } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  is_active: z.boolean(),
  userRole: z.string().min(1, 'User role is required'),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  user?: User | null
  setIsModalOpen: (arg: boolean) => void
  roles: string[]
}

export default function UserForm({ user,roles, setIsModalOpen, }: UserFormProps) {
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
      phone:user?.phone || ""
    },
  })


  const queryClient = useQueryClient();

  const createDataMutation = useMutation({
    mutationFn: data => dataTableService.createData("/user/add", data),
    onSuccess:()=>{
      toast.success("Department added Successfully");
      queryClient.invalidateQueries({ queryKey: ['/user']});
      setIsModalOpen(false)
    },
    onError:()=>{
      toast.error("Failed to add department")
    },
  })



  // const updateDataMutation = useMutation({
  //   mutationFn: data =>  dataTableService.updateData(`/department/departments/${department?._id}`, data),
  //   onSuccess: () => {
  //     toast.success('Department Update successfully');
  //     queryClient.invalidateQueries({ queryKey: ['/user'] });
  //     setIsModalOpen(false)
  //   },

  //   onError: () => {
  //     toast.error('Failed to update asset block');
  //   },
  // })



  const onSubmit = async(data:User)=>{
    createDataMutation.mutate(data)
    // if(user){
    //   updateDataMutation.mutate(data)
    // }else{
    //   createDataMutation.mutate(data)
    // }
  }




  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <Input id="username" {...register("username")} className="mt-1" />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      {!user && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="first_name"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <Input id="first_name" {...register("first_name")} className="mt-1" />
        {errors.first_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.first_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="last_name"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <Input id="last_name" {...register("last_name")} className="mt-1" />
        {errors.last_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.last_name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <Input
          id="phone"
          type="phone"
          {...register("phone")}
          className="mt-1"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="userRole"
          className="block text-sm font-medium text-gray-700"
        >
          User Role
        </label>
        <select
          id="userRole"
          {...register("userRole")}
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
          {...register("is_active")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-gray-700"
        >
          Active
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save User</Button>
      </div>
    </form>
  );
}