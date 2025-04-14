import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { AssetCategory } from '@/lib/types'

const categorySchema = z.object({
  category_name: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface AssetCategoryFormProps {
  category?: AssetCategory | null
  onSubmit: (data: CategoryFormData) => void
}

export default function AssetCategoryForm({
  category,
  onSubmit,
}: AssetCategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: category?.category_name || '',
      description: category?.description || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="category_name"
          className="block text-sm font-medium text-gray-700"
        >
          Category Name
        </label>
        <Input
          id="category_name"
          {...register('category_name')}
          className="mt-1"
          placeholder="e.g., IT Equipment"
        />
        {errors.category_name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category_name.message}
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
          placeholder="Describe this asset category"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Category</Button>
      </div>
    </form>
  )
}