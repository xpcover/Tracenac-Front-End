import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Asset } from '@/lib/types'
import AssetForm from './AssetForm'
import { useDataTable } from '@/hooks/useDataTable'

const columnHelper = createColumnHelper<Asset>()

const columns = [
  columnHelper.accessor('image_url', {
    header: 'Image',
    cell: (info) => (
      <div className="w-12 h-12">
        {info.getValue() ? (
          <img
            src={info.getValue()}
            alt={info.row.original.assetName}
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
        // onClick={() => info.table.options.meta?.onAssetClick?.(info.row.original)}
        className="text-blue-600 hover:underline font-medium"
      >
        {/* {info.getValue()} */}
      </button>
    ),
  }),
  columnHelper.accessor('assetName', {
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
            Active: 'bg-green-100 text-green-800',
            InActive: 'bg-gray-100 text-gray-800',
            Maintenance: 'bg-yellow-100 text-yellow-800',
            Disposed: 'bg-red-100 text-red-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('purchase_date', {
    header: 'Purchase Date',
    cell: (info) => format(new Date(), 'PP'),
  }),
  columnHelper.accessor('purchase_cost', {
    header: 'Purchase Cost',
    cell: (info) => (
      <span className="font-mono">
        {/* {info.row.original.purchase_currency}{' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} */}
      </span>
    ),
  }),
  columnHelper.accessor('current_value', {
    header: 'Current Value',
    cell: (info) => (
      <span className="font-mono">
        {/* {info.row.original.purchase_currency}{' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} */}
      </span>
    ),
  }),
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

  const { createData, updateData, deleteData } = useDataTable();

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
        url="/assets"
        columns={columns}
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
            onSubmit={async(data) => {
              const result = await createData.mutateAsync({
                url: '/assets',
                data
              });
              
              console.log('Created:', result);
              
              setIsModalOpen(false)
              setEditingAsset(null)
            }}
          />
        </Modal>
    </div>
  )
}