import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import DepreciationRecordForm from './DepreciationRecordForm'

interface DepreciationRecord {
  depreciation_id: string
  tenant_id: string
  asset_id: string
  component_id: string | null
  fiscal_year: string
  period_start_date: string
  period_end_date: string
  depreciation_amount: number
  book_type: 'tax' | 'financial'
  method: string
  rate: number
  method_changed: boolean
  changed_by: string | null
  notes: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<DepreciationRecord>()

const columns = [
  columnHelper.accessor('asset_id', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fiscal_year', {
    header: 'Fiscal Year',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('period_start_date', {
    header: 'Period Start',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('period_end_date', {
    header: 'Period End',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('depreciation_amount', {
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
  columnHelper.accessor('book_type', {
    header: 'Book Type',
    cell: (info) => info.getValue().toUpperCase(),
  }),
  columnHelper.accessor('method', {
    header: 'Method',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('method_changed', {
    header: 'Method Changed',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          info.getValue()
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {info.getValue() ? 'Yes' : 'No'}
      </span>
    ),
  }),
]

// Mock data - In a real app, this would come from an API
const mockRecords: DepreciationRecord[] = [
  {
    depreciation_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    component_id: null,
    fiscal_year: '2024',
    period_start_date: '2024-01-01',
    period_end_date: '2024-03-31',
    depreciation_amount: 124.99,
    book_type: 'financial',
    method: 'straight-line',
    rate: 20,
    method_changed: false,
    changed_by: null,
    notes: 'Q1 2024 depreciation',
    created_at: '2024-03-31T23:59:59Z',
    updated_at: '2024-03-31T23:59:59Z',
  },
]

export default function DepreciationRecordsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DepreciationRecord | null>(null)

  const handleEdit = (record: DepreciationRecord) => {
    setEditingRecord(record)
    setIsModalOpen(true)
  }

  const handleDelete = (record: DepreciationRecord) => {
    // In a real app, this would make an API call
    console.log('Delete record:', record)
  }

  return (
    <div>
      <PageHeader
        title="Depreciation Records"
        description="Track and manage asset depreciation records"
        action={{
          label: 'Add Record',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        title={editingRecord ? 'Edit Record' : 'Add Record'}
      >
        <DepreciationRecordForm
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