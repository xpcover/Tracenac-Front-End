import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Department } from '@/lib/types'
import DepartmentForm from './DepartmentForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const columnHelper = createColumnHelper<Department>()

const columns = [
  columnHelper.accessor('departmentName', {
    header: 'Name',
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

export default function DepartmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [viewDepartment, setViewDepartment] = useState<Department | null>(null)

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/departments'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }
  
  const handleView = (department:Department)=>{
    setViewDepartment(department)
    setIsModalOpen(true)
  }

  const handleDelete = (department: Department) => {
    deleteMutation.mutate(`/department/departments/${department?._id}`)
  }

  return (
    <div>
      <PageHeader
        title="Department"
        description="Manage Department"
        action={{
          label: 'Add Department',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url="/department/departments"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView = {handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
          setViewDepartment(null)
        }}
        title={
          viewDepartment
            ? 'View Department' // 👈 Set title for view mode
            : editingDepartment
            ? 'Edit Department'
            : 'Add  Department'
        }
      >
      <DepartmentForm
          department={editingDepartment}
          setIsModalOpen={setIsModalOpen}
          viewDepartment={viewDepartment}
      />
      </Modal>
    </div>
  )
}