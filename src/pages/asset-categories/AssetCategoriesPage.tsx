import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { AssetCategory } from '@/lib/types'
import AssetCategoryForm from './AssetCategoryForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

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
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]


export default function AssetCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AssetCategory | null>(null)


  const handleEdit = (category: AssetCategory) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Asset category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/category'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });


  const handleDelete = (category: AssetCategory) => {
    deleteMutation.mutate(`/category/${category?._id}`)
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
        url='/category'
        columns={columns}
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
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  )
}