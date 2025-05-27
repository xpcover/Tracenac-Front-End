import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import AssetLabelForm from './AssetLabelForm'

interface AssetLabel {
  label_id: string
  tenant_id: string
  asset_id: string
  label_type: 'qr' | 'barcode' | 'rfid'
  label_data: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<AssetLabel>()

const columns = [
  columnHelper.accessor('asset_id', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('label_type', {
    header: 'Label Type',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            qr: 'bg-blue-100 text-blue-800',
            barcode: 'bg-purple-100 text-purple-800',
            rfid: 'bg-green-100 text-green-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().toUpperCase()}
      </span>
    ),
  }),
  columnHelper.accessor('label_data', {
    header: 'Label Data',
    cell: (info) => (
      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
        {info.getValue()}
      </code>
    ),
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

// Mock data
const mockLabels: AssetLabel[] = [
  {
    label_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    label_type: 'qr',
    label_data: 'https://asset.track/LAP001',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    label_id: '2',
    tenant_id: '1',
    asset_id: 'DSK001',
    label_type: 'barcode',
    label_data: '123456789',
    created_at: '2024-03-15T11:00:00Z',
    updated_at: '2024-03-15T11:00:00Z',
  },
]

export default function AssetLabelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<AssetLabel | null>(null)
  const [viewComponent,setViewComponent] = useState<AssetLabel  | null>(null)

  const handleEdit = (label: AssetLabel) => {
    setEditingLabel(label)
    setIsModalOpen(true)
  }

  const handleDelete = (label: AssetLabel) => {
    // In a real app, this would make an API call
    console.log('Delete label:', label)
  }

  const handleView = (label: AssetLabel) => {
    setViewComponent(label)
    setIsModalOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Asset Labels"
        description="Manage asset identification labels"
        action={{
          label: 'Add Label',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockLabels}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView = {handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLabel(null)
        }}
        title={editingLabel ? 'Edit Label' : 'Add Label'}
      >
        <AssetLabelForm
          label={editingLabel}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingLabel(null)
          }}
        />
      </Modal>
    </div>
  )
}