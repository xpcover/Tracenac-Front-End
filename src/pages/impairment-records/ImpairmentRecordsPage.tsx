import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ImpairmentRecordForm from './ImpairmentRecordForm'

interface ImpairmentRecord {
  record_id: string
  tenant_id: string
  asset_id: string
  impairment_date: string
  impairment_amount: number
  reason: string
  recorded_by: string
  location_id: string | null
  address: string | null
  notes: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<ImpairmentRecord>()

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
  columnHelper.accessor('impairment_date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('impairment_amount', {
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
  columnHelper.accessor('reason', {
    header: 'Reason',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('recorded_by', {
    header: 'Recorded By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockRecords: ImpairmentRecord[] = [
  {
    record_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    impairment_date: '2024-03-15',
    impairment_amount: 500,
    reason: 'Physical damage',
    recorded_by: 'USER001',
    location_id: 'LOC001',
    address: '123 Business St, NY',
    notes: 'Screen damage requires repair',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
]

export default function ImpairmentRecordsPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ImpairmentRecord | null>(null)

  const handleEdit = (record: ImpairmentRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const handleDelete = (record: ImpairmentRecord) => {
    // In a real app, this would make an API call
    console.log('Delete record:', record)
  }

  return (
    <div>
      <PageHeader
        title="Impairment Records"
        description="Track asset value impairments"
      />

      <DataTable
        columns={columns}
        data={mockRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showFilters
        showDateFilter
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        title={editingRecord ? 'Edit Record' : 'Add Record'}
      >
        <ImpairmentRecordForm
          record={editingRecord}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingRecord(null)
          }}
        />
      </Modal>
    </div>
  )
}