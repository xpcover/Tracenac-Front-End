import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { AssetCategory } from '@/lib/types'
import AssetCategoryForm from './AssetCategoryForm'

const columnHelper = createColumnHelper<AssetCategory>()

const columns = [
  columnHelper.accessor('category_id', {
    header: 'Category ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data - In a real app, this would come from an API
const mockCategories: AssetCategory[] = [
  {
    category_id: '1',
    tenant_id: '1',
    category_name: 'IT Equipment',
    description: 'Computers, laptops, and peripherals',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    category_id: '2',
    tenant_id: '1',
    category_name: 'Office Furniture',
    description: 'Desks, chairs, and storage units',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function AssetCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null)

  const handleEdit = (category: AssetCategory) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = (category: AssetCategory) => {
    // In a real app, this would make an API call
    console.log('Delete category:', category)
  }

  return (
    <div>
      <PageHeader
        title="Asset Categories"
        description="Manage asset categories and classifications"
        action={{
          label: 'Add Category',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        url='/assets/categories'
        columns={columns}
        data={mockCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <AssetCategoryForm
          category={editingCategory}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingCategory(null)
          }}
        />
      </Modal>
    </div>
  )
}