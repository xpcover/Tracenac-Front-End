import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Asset } from '@/lib/types'
import AssetForm from './AssetForm'

const columnHelper = createColumnHelper<Asset>()

const columns = [
  columnHelper.accessor('image_url', {
    header: 'Image',
    cell: (info) => (
      <div className="w-12 h-12">
        {info.getValue() ? (
          <img
            src={info.getValue()}
            alt={info.row.original.asset_name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            N/A
          </div>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('asset_code', {
    header: 'Asset Code',
    cell: (info) => (
      <button
        onClick={() => info.table.options.meta?.onAssetClick?.(info.row.original)}
        className="text-blue-600 hover:underline font-medium"
      >
        {info.getValue()}
      </button>
    ),
  }),
  columnHelper.accessor('asset_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('asset_type', {
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
        {info.row.original.purchase_currency}{' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('current_value', {
    header: 'Current Value',
    cell: (info) => (
      <span className="font-mono">
        {info.row.original.purchase_currency}{' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
]

// Mock data - In a real app, this would come from an API
const mockAssets: Asset[] = [
  {
    asset_id: 'LAP001', // Changed to match the expected format
    tenant_id: '1',
    asset_code: 'LAP001',
    asset_name: 'MacBook Pro 16"',
    asset_type: 'Laptop',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=250&h=250&fit=crop',
    category_id: '1',
    block_id: '1',
    department_id: '1',
    location_id: '1',
    latitude: 40.7128,
    longitude: -74.006,
    address: '123 Business St, NY',
    cost_centre_id: '1',
    purchase_date: '2024-01-15',
    purchase_cost: 2499.99,
    purchase_currency: 'USD',
    exchange_rate: 1,
    current_value: 2249.99,
    depreciation_method: 'straight-line',
    depreciation_rate: 20,
    useful_life: 5,
    salvage_value: 500,
    lease_end_date: null,
    warranty_end_date: '2025-01-15',
    insurance_end_date: '2025-01-15',
    amc_end_date: null,
    market_valuation: 2000,
    status: 'active',
    barcode: '123456789',
    impairment_value: 0,
    notes: 'Developer laptop',
    created_by: '1',
    updated_by: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  // Add more mock assets here
]

const ASSET_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'disposed', label: 'Disposed' },
]

export default function AssetsPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setIsModalOpen(true)
  }

  const handleDelete = (asset: Asset) => {
    // In a real app, this would make an API call
    console.log('Delete asset:', asset)
  }

  const handleAssetClick = (asset: Asset) => {
    navigate(`/assets/${asset.asset_id}`)
  }

  const additionalFilters = (
    <select
      className="rounded-md border-gray-300 py-1.5 text-sm font-medium focus:border-blue-500 focus:ring-blue-500"
      defaultValue=""
    >
      <option value="">All Statuses</option>
      {ASSET_STATUS_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Manage your organization's assets"
        action={{
          label: 'Add Asset',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockAssets}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showDateFilter
        additionalFilters={additionalFilters}
        meta={{
          onAssetClick: handleAssetClick,
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAsset(null)
        }}
        title={editingAsset ? 'Edit Asset' : 'Add Asset'}
      >
        <AssetForm
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