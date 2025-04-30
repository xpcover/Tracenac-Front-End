import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, DollarSign, Calendar, MapPin, User, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/Table'
import { createColumnHelper } from '@tanstack/react-table'
import Button from '@/components/ui/Button'

interface ImpairmentRecord {
  record_id: string
  asset_id: string
  impairment_date: string
  impairment_amount: number
  reason: string
  recorded_by: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  attachments: {
    type: 'image' | 'document'
    url: string
    name: string
  }[]
  notes: string
  created_at: string
}

const columnHelper = createColumnHelper<ImpairmentRecord>()

const columns = [
  columnHelper.accessor('impairment_date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('impairment_amount', {
    header: 'Amount',
    cell: (info) => (
      <span className="font-mono">
        $ {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('recorded_by', {
    header: 'Recorded By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => info.getValue().address,
  }),
  columnHelper.accessor('reason', {
    header: 'Reason',
    cell: (info) => info.getValue(),
  }),
]

// Mock data
const mockAsset = {
  id: 'LAP001',
  name: 'MacBook Pro 16"',
  purchase_cost: 2499.99,
  current_value: 1999.99,
  total_impairment: 500.00,
  currency: 'USD',
}

const mockRecords: ImpairmentRecord[] = [
  {
    record_id: '1',
    asset_id: 'LAP001',
    impairment_date: '2024-03-15',
    impairment_amount: 300.00,
    reason: 'Physical damage to screen',
    recorded_by: 'John Doe',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY',
    },
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800',
        name: 'Damage Photo 1',
      },
      {
        type: 'document',
        url: '#',
        name: 'Assessment Report.pdf',
      },
    ],
    notes: 'Screen replacement required',
    created_at: '2024-03-15T10:00:00Z',
  },
  {
    record_id: '2',
    asset_id: 'LAP001',
    impairment_date: '2024-02-01',
    impairment_amount: 200.00,
    reason: 'Battery degradation',
    recorded_by: 'Jane Smith',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Tech Ave, NY',
    },
    attachments: [
      {
        type: 'document',
        url: '#',
        name: 'Battery Report.pdf',
      },
    ],
    notes: 'Battery capacity below 60%',
    created_at: '2024-02-01T15:30:00Z',
  },
]

export default function ImpairmentRecordDetails() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Impairment Records - ${mockAsset.name}`}
        description={`Asset ID: ${mockAsset.id}`}
      >
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Purchase Cost</p>
                  <p className="text-lg font-semibold">
                    {mockAsset.currency} {mockAsset.purchase_cost.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Current Value</p>
                  <p className="text-lg font-semibold">
                    {mockAsset.currency} {mockAsset.current_value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Impairment</p>
                  <p className="text-lg font-semibold">
                    {mockAsset.currency} {mockAsset.total_impairment.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Impairment History</h2>
              <DataTable
                columns={columns}
                data={mockRecords}
                showFilters
                showDateFilter
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Latest Record */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Latest Impairment</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {format(new Date(mockRecords[0].impairment_date), 'PP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {mockAsset.currency} {mockRecords[0].impairment_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Recorded By</p>
                  <p className="font-medium">{mockRecords[0].recorded_by}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{mockRecords[0].location.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p className="font-medium">{mockRecords[0].reason}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Attachments</h3>
            <div className="space-y-3">
              {mockRecords[0].attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {attachment.type === 'image' ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <FileText className="w-10 h-10 text-gray-400" />
                    )}
                    <span className="text-sm font-medium">{attachment.name}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}