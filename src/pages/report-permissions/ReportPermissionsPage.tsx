import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ReportPermissionForm from './ReportPermissionForm'

interface ReportPermission {
  report_id: string
  role_id: string
  permission: 'view' | 'edit' | 'approve'
  assigned_at: string
}

const columnHelper = createColumnHelper<ReportPermission>()

const columns = [
  columnHelper.accessor('report_id', {
    header: 'Report ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role_id', {
    header: 'Role ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('permission', {
    header: 'Permission',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            view: 'bg-blue-100 text-blue-800',
            edit: 'bg-yellow-100 text-yellow-800',
            approve: 'bg-green-100 text-green-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
  columnHelper.accessor('assigned_at', {
    header: 'Assigned At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockPermissions: ReportPermission[] = [
  {
    report_id: 'REP001',
    role_id: 'ROLE001',
    permission: 'view',
    assigned_at: '2024-03-15T10:00:00Z',
  },
  {
    report_id: 'REP001',
    role_id: 'ROLE002',
    permission: 'approve',
    assigned_at: '2024-03-15T11:00:00Z',
  },
]

export default function ReportPermissionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<ReportPermission | null>(null)

  const handleEdit = (permission: ReportPermission) => {
    setEditingPermission(permission)
    setIsModalOpen(true)
  }

  const handleDelete = (permission: ReportPermission) => {
    // In a real app, this would make an API call
    console.log('Delete permission:', permission)
  }

  return (
    <div>
      <PageHeader
        title="Report Permissions"
        description="Manage access control for reports"
        action={{
          label: 'Add Permission',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockPermissions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPermission(null)
        }}
        title={editingPermission ? 'Edit Permission' : 'Add Permission'}
      >
        <ReportPermissionForm
          permission={editingPermission}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingPermission(null)
          }}
        />
      </Modal>
    </div>
  )
}