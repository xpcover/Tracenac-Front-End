import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Subscription } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'
import SubscriptionForm from './SubscriptionForm'

const columnHelper = createColumnHelper<Subscription>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Tenant ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('noOfLocations', {
    header: 'No. of Locations',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('noOfAssets', {
    header: 'No. of Assets',
    cell: (info) => info.getValue()
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function SubscriptionList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const handleEdit = (data: Subscription) => {
    setEditingSubscription(data)
    setIsModalOpen(true)
  }

  const handleDelete = (data: Subscription) => {
    // In a real app, this would make an API call
    console.log('Delete tenant:', data)
  }

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        description="Manage Subscriptions"
        action={{
          label: 'Add Subscription',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url='/tenant/get-subscriptions'
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSubscription(null)
        }}
        title={editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
      >
        <SubscriptionForm
        setIsModalOpen={setIsModalOpen}
        data={editingSubscription}
        />
      </Modal>
    </div>
  )
}