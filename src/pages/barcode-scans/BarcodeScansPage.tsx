import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import BarcodeScanForm from './BarcodeScanForm'

interface BarcodeScan {
  scan_id: string
  tenant_id: string
  asset_id: string
  barcode_data: string
  scan_date: string
  scanned_by: string
  latitude: number | null
  longitude: number | null
  location_id: string | null
  address: string | null
  verification_status: 'verified' | 'unverified' | 'failed'
  notes: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<BarcodeScan>()

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
  columnHelper.accessor('barcode_data', {
    header: 'Barcode Data',
    cell: (info) => (
      <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
        {info.getValue()}
      </code>
    ),
  }),
  columnHelper.accessor('scan_date', {
    header: 'Scan Date',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('scanned_by', {
    header: 'Scanned By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('verification_status', {
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            verified: 'bg-green-100 text-green-800',
            unverified: 'bg-yellow-100 text-yellow-800',
            failed: 'bg-red-100 text-red-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
  columnHelper.accessor('location_id', {
    header: 'Location',
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockScans: BarcodeScan[] = [
  {
    scan_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    barcode_data: '123456789',
    scan_date: '2024-03-15T10:00:00Z',
    scanned_by: 'USER001',
    latitude: 40.7128,
    longitude: -74.006,
    location_id: 'LOC001',
    address: '123 Business St, NY',
    verification_status: 'verified',
    notes: 'Regular verification scan',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
]

export default function BarcodeScansPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScan, setEditingScan] = useState<BarcodeScan | null>(null)

  const handleEdit = (scan: BarcodeScan) => {
    setEditingScan(scan)
    setIsModalOpen(true)
  }

  const handleDelete = (scan: BarcodeScan) => {
    // In a real app, this would make an API call
    console.log('Delete scan:', scan)
  }

  return (
    <div>
      <PageHeader
        title="Barcode Scans"
        description="Track and verify asset barcode scans"
      />

      <DataTable
        columns={columns}
        data={mockScans}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showFilters
        showDateFilter
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingScan(null)
        }}
        title={editingScan ? 'Edit Scan' : 'Add Scan'}
      >
        <BarcodeScanForm
          scan={editingScan}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingScan(null)
          }}
        />
      </Modal>
    </div>
  )
}