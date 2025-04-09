import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import NotificationForm from './NotificationForm'

interface Notification {
  notification_id: string
  tenant_id: string
  user_id: string
  type: 'info' | 'warning' | 'critical'
  message: string
  due_date: string | null
  is_read: boolean
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Notification>()

const columns = [
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            info: 'bg-blue-100 text-blue-800',
            warning: 'bg-yellow-100 text-yellow-800',
            critical: 'bg-red-100 text-red-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
  columnHelper.accessor('message', {
    header: 'Message',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('due_date', {
    header: 'Due Date',
    cell: (info) => info.getValue() ? format(new Date(info.getValue()!), 'PP') : '-',
  }),
  columnHelper.accessor('is_read', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          info.getValue() ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
        }`}
      >
        {info.getValue() ? 'Read' : 'Unread'}
      </span>
    ),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockNotifications: Notification[] = [
  {
    notification_id: '1',
    tenant_id: '1',
    user_id: '1',
    type: 'warning',
    message: 'Asset LAP001 warranty expires in 30 days',
    due_date: '2024-04-15',
    is_read: false,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    notification_id: '2',
    tenant_id: '1',
    user_id: '1',
    type: 'critical',
    message: 'Asset SRV002 maintenance overdue',
    due_date: '2024-03-10',
    is_read: false,
    created_at: '2024-03-14T15:30:00Z',
    updated_at: '2024-03-14T15:30:00Z',
  },
]

export default function NotificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification)
    setIsModalOpen(true)
  }

  const handleDelete = (notification: Notification) => {
    // In a real app, this would make an API call
    console.log('Delete notification:', notification)
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Manage system notifications and alerts"
        action={{
          label: 'Add Notification',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockNotifications}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNotification(null)
        }}
        title={editingNotification ? 'Edit Notification' : 'Add Notification'}
      >
        <NotificationForm
          notification={editingNotification}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingNotification(null)
          }}
        />
      </Modal>
    </div>
  )
}