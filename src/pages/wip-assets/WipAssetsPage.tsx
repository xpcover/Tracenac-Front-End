import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import WipAssetForm from './WipAssetForm'

interface WipAsset {
  wip_id: string
  tenant_id: string
  asset_name: string
  project_name: string
  start_date: string
  expected_completion_date: string
  accumulated_cost: number
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled'
  latitude: number | null
  longitude: number | null
  address: string | null
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<WipAsset>()

const columns = [
  columnHelper.accessor('asset_id', {
    header: 'Asset ID',
    cell: (info) => (
      <Link
        to={`/assets/${info.getValue()}/timeline`}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('asset_name', {
    header: 'Asset Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('project_name', {
    header: 'Project',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('start_date', {
    header: 'Start Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('expected_completion_date', {
    header: 'Expected Completion',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('accumulated_cost', {
    header: 'Accumulated Cost',
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
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            planning: 'bg-blue-100 text-blue-800',
            'in-progress': 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
]

// Mock data
const mockWipAssets: WipAsset[] = [
  {
    wip_id: '1',
    tenant_id: '1',
    asset_name: 'New Manufacturing Line',
    project_name: 'Factory Expansion Phase 1',
    start_date: '2024-01-15',
    expected_completion_date: '2024-06-30',
    accumulated_cost: 250000,
    status: 'in-progress',
    latitude: 40.7128,
    longitude: -74.006,
    address: '123 Industrial Park, NY',
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-15T15:30:00Z',
  },
]

export default function WipAssetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<WipAsset | null>(null)

  const handleEdit = (asset: WipAsset) => {
    setEditingAsset(asset)
    setIsModalOpen(true)
  }

  const handleDelete = (asset: WipAsset) => {
    // In a real app, this would make an API call
    console.log('Delete WIP asset:', asset)
  }

  return (
    <div>
      <PageHeader
        title="WIP Assets"
        description="Manage work-in-progress assets"
      />

      <DataTable
        columns={columns}
        data={mockWipAssets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showFilters
        showDateFilter
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAsset(null)
        }}
        title={editingAsset ? 'Edit WIP Asset' : 'Add WIP Asset'}
      >
        <WipAssetForm
          asset={editingAsset}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingAsset(null)
          }}
        />
      </Modal>
    </div>
  )
}