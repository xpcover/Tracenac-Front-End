import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Department } from '@/lib/types'
import DepartmentForm from './DepartmentForm'

const columnHelper = createColumnHelper<Department>()

const columns = [
  columnHelper.accessor('department_id', {
    header: 'Department ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('department_name', {
    header: 'Name',
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
const mockDepartments: Department[] = [
  {
    department_id: '1',
    tenant_id: '1',
    department_name: 'IT Department',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    department_id: '2',
    tenant_id: '1',
    department_name: 'Human Resources',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function DepartmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  const handleDelete = (department: Department) => {
    // In a real app, this would make an API call
    console.log('Delete department:', department)
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage organizational departments"
        action={{
          label: 'Add Department',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockDepartments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
        }}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
      >
        <DepartmentForm
          department={editingDepartment}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingDepartment(null)
          }}
        />
      </Modal>
    </div>
  )
}