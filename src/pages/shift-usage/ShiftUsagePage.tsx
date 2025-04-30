import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ShiftUsageForm from './ShiftUsageForm'

interface ShiftUsage {
  usage_id: string
  tenant_id: string
  asset_id: string
  date: string
  shift: 'morning' | 'afternoon' | 'night'
  usage_hours: number
  operator_id: string
  location_id: string
  latitude: number | null
  longitude: number | null
  address: string | null
  notes: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<ShiftUsage>()

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
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('shift', {
    header: 'Shift',
    cell: (info) => (
      <span className="capitalize">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('usage_hours', {
    header: 'Hours',
    cell: (info) => `${info.getValue()} hrs`,
  }),
  columnHelper.accessor('operator_id', {
    header: 'Operator',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location_id', {
    header: 'Location',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockUsages: ShiftUsage[] = [
  {
    usage_id: '1',
    tenant_id: '1',
    asset_id: 'FORK001',
    date: '2024-03-15',
    shift: 'morning',
    usage_hours: 6,
    operator_id: 'OP001',
    location_id: 'LOC001',
    latitude: 40.7128,
    longitude: -74.006,
    address: '123 Business St, NY',
    notes: 'Regular operation',
    created_at: '2024-03-15T15:00:00Z',
    updated_at: '2024-03-15T15:00:00Z',
  },
]

export default function ShiftUsagePage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUsage, setEditingUsage] = useState<ShiftUsage | null>(null)

  const handleEdit = (usage: ShiftUsage) => {
    setEditingUsage(usage)
    setIsModalOpen(true)
  }

  const handleDelete = (usage: ShiftUsage) => {
    // In a real app, this would make an API call
    console.log('Delete usage:', usage)
  }

  return (
    <div>
      <PageHeader
        title="Shift Usage"
        description="Track asset usage across different shifts"
      />

      <DataTable
        columns={columns}
        data={mockUsages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showFilters
        showDateFilter
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUsage(null)
        }}
        title={editingUsage ? 'Edit Usage' : 'Add Usage'}
      >
        <ShiftUsageForm
          usage={editingUsage}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingUsage(null)
          }}
        />
      </Modal>
    </div>
  )
}