import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import LeaseForm from './LeaseForm'

interface Lease {
  lease_id: string
  tenant_id: string
  asset_id: string
  lessor_name: string
  lease_start: string
  lease_end: string
  lease_terms: string
  lease_amount: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Lease>()

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
  columnHelper.accessor('lessor_name', {
    header: 'Lessor',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lease_start', {
    header: 'Start Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('lease_end', {
    header: 'End Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('lease_amount', {
    header: 'Amount',
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

// Mock data
const mockLeases: Lease[] = [
  {
    lease_id: '1',
    tenant_id: '1',
    asset_id: 'VEH001',
    lessor_name: 'Fleet Co.',
    lease_start: '2024-01-01',
    lease_end: '2024-12-31',
    lease_terms: 'Monthly payments, includes maintenance',
    lease_amount: 500,
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
]

export default function LeasesPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLease, setEditingLease] = useState<Lease | null>(null)

  const handleEdit = (lease: Lease) => {
    setEditingLease(lease)
    setIsModalOpen(true)
  }

  const handleDelete = (lease: Lease) => {
    // In a real app, this would make an API call
    console.log('Delete lease:', lease)
  }

  return (
    <div>
      <PageHeader
        title="Leases"
        description="Manage asset lease agreements"
      />

      <DataTable
        columns={columns}
        data={mockLeases}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showFilters
        showDateFilter
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLease(null)
        }}
        title={editingLease ? 'Edit Lease' : 'Add Lease'}
      >
        <LeaseForm
          lease={editingLease}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingLease(null)
          }}
        />
      </Modal>
    </div>
  )
}