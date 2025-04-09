import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Role } from '@/lib/types'
import RoleForm from './RoleForm'

const columnHelper = createColumnHelper<Role>()

const columns = [
  columnHelper.accessor('role_id', {
    header: 'Role ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role_name', {
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
const mockRoles: Role[] = [
  {
    role_id: '1',
    tenant_id: '1',
    role_name: 'Admin',
    description: 'Full system access',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    role_id: '2',
    tenant_id: '1',
    role_name: 'User',
    description: 'Limited system access',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  const handleDelete = (role: Role) => {
    // In a real app, this would make an API call
    console.log('Delete role:', role)
  }

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Manage user roles and their permissions"
        action={{
          label: 'Add Role',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockRoles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRole(null)
        }}
        title={editingRole ? 'Edit Role' : 'Add Role'}
      >
        <RoleForm
          role={editingRole}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingRole(null)
          }}
        />
      </Modal>
    </div>
  )
}