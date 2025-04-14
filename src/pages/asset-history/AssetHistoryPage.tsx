import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Link, useNavigate } from 'react-router-dom'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import AssetHistoryForm from './AssetHistoryForm'
import axios from 'axios'

interface AssetHistory {
  _id: string
  tenantId: string
  assetId: string
  date: string | null
  latitude: number
  longitude: number
  address: string
  reportType: string
  attachments: string[]
  assignedTo: string
  dynamicFields: { name: string, value: any }[]
  createdAt: string
  updatedAt: string
}

const columnHelper = createColumnHelper<AssetHistory>()

const columns = [
  columnHelper.accessor('assetId', {
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
    cell: (info) => {
      const value = info.getValue()
      return value ? format(new Date(value), 'PPp') : 'N/A'
    },
  }),
  columnHelper.accessor('reportType', {
    header: 'Report Type',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('assignedTo', {
    header: 'Assigned To',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function AssetHistoryPage() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHistory, setEditingHistory] = useState<AssetHistory | null>(null)
  const [assetHistoryData, setAssetHistoryData] = useState<AssetHistory[]>([])

  useEffect(() => {
    const fetchAssetHistory = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      try {
        const response = await axios.get('https://api.tracenac.com/api/assets/asset-history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        console.log('Fetched asset history data:', response.data) // Debugging log

        if (Array.isArray(response.data)) {
          setAssetHistoryData(response.data)
        } else {
          console.error('Unexpected data format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching asset history:', error)
      }
    }

    fetchAssetHistory()
  }, [])

  const handleEdit = (history: AssetHistory) => {
    setEditingHistory(history)
    setIsModalOpen(true)
  }

  const handleDelete = (history: AssetHistory) => {
    console.log('Delete history:', history)
  }

  const handleAssetClick = (assetId: string) => {
    navigate(`/assets/${assetId}`)
  }

  return (
    <div>
      <PageHeader title="Asset History" description="Track changes and updates to assets" />

      {assetHistoryData.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No asset history available</p>
      ) : (
        <DataTable
          columns={columns}
          data={assetHistoryData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showFilters
          showDateFilter
          meta={{ onAssetClick: handleAssetClick }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingHistory(null)
        }}
        title={editingHistory ? 'Edit History' : 'Add History'}
      >
        <AssetHistoryForm
          history={editingHistory}
          onSubmit={(data) => {
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingHistory(null)
          }}
        />
      </Modal>
    </div>
  )
}
