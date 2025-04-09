import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { AssetComponent } from '@/lib/types'
import AssetComponentForm from './AssetComponentForm'

const columnHelper = createColumnHelper<AssetComponent>()

const columns = [
  columnHelper.accessor('component_id', {
    header: 'Component ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('component_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('component_type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            maintenance: 'bg-yellow-100 text-yellow-800',
            disposed: 'bg-red-100 text-red-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
  columnHelper.accessor('purchase_date', {
    header: 'Purchase Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('purchase_cost', {
    header: 'Purchase Cost',
    cell: (info) => (
      <span className="font-mono">
        ${' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data - In a real app, this would come from an API
const mockComponents: AssetComponent[] = [
  {
    component_id: '1',
    tenant_id: '1',
    asset_id: '1',
    parent_component_id: null,
    component_name: 'RAM Module',
    component_type: 'Memory',
    purchase_cost: 199.99,
    purchase_date: '2024-01-15',
    depreciation_method: 'straight-line',
    depreciation_rate: 20,
    useful_life: 5,
    salvage_value: 0,
    status: 'active',
    created_by: '1',
    updated_by: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
]

export default function AssetComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingComponent, setEditingComponent] = useState<AssetComponent | null>(null)

  const handleEdit = (component: AssetComponent) => {
    setEditingComponent(component)
    setIsModalOpen(true)
  }

  const handleDelete = (component: AssetComponent) => {
    // In a real app, this would make an API call
    console.log('Delete component:', component)
  }

  return (
    <div>
      <PageHeader
        title="Asset Components"
        description="Manage components and parts of assets"
        action={{
          label: 'Add Component',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockComponents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingComponent(null)
        }}
        title={editingComponent ? 'Edit Component' : 'Add Component'}
      >
        <AssetComponentForm
          component={editingComponent}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingComponent(null)
          }}
        />
      </Modal>
    </div>
  )
}