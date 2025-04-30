import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, DollarSign, MapPin, User, MessageSquare, Image as ImageIcon, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/Table'
import { createColumnHelper } from '@tanstack/react-table'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface LeaseRecord {
  lease_id: string
  asset_id: string
  lessor_name: string
  lease_start: string
  lease_end: string
  lease_amount: number
  location: {
    latitude: number
    longitude: number
    address: string
  }
  status: 'active' | 'expired' | 'terminated'
  comments: {
    id: string
    user: string
    date: string
    content: string
  }[]
  attachments: {
    type: 'image' | 'video' | 'document'
    url: string
    name: string
    thumbnail?: string
  }[]
}

const columnHelper = createColumnHelper<LeaseRecord>()

const columns = [
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
        $ {info.getValue().toLocaleString(undefined, {
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
            active: 'bg-green-100 text-green-800',
            expired: 'bg-red-100 text-red-800',
            terminated: 'bg-gray-100 text-gray-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
]

// Mock data
const mockAsset = {
  id: 'VEH001',
  name: 'Toyota Forklift',
  type: 'Vehicle',
  category: 'Heavy Equipment',
}

const mockLeases: LeaseRecord[] = [
  {
    lease_id: '1',
    asset_id: 'VEH001',
    lessor_name: 'Warehouse A',
    lease_start: '2024-01-01',
    lease_end: '2024-06-30',
    lease_amount: 1200.00,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Warehouse St, NY',
    },
    status: 'active',
    comments: [
      {
        id: '1',
        user: 'John Doe',
        date: '2024-03-15T10:00:00Z',
        content: 'Monthly maintenance completed',
      },
      {
        id: '2',
        user: 'Jane Smith',
        date: '2024-03-01T15:30:00Z',
        content: 'Lease terms updated',
      },
    ],
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800',
        name: 'Equipment Photo',
      },
      {
        type: 'document',
        url: '#',
        name: 'Lease Agreement.pdf',
      },
      {
        type: 'video',
        url: '#',
        name: 'Operation Video.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200',
      },
    ],
  },
  {
    lease_id: '2',
    asset_id: 'VEH001',
    lessor_name: 'Warehouse B',
    lease_start: '2023-07-01',
    lease_end: '2023-12-31',
    lease_amount: 1100.00,
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Storage Ave, NY',
    },
    status: 'expired',
    comments: [
      {
        id: '3',
        user: 'Mike Wilson',
        date: '2023-12-15T09:00:00Z',
        content: 'Final inspection completed',
      },
    ],
    attachments: [
      {
        type: 'document',
        url: '#',
        name: 'Inspection Report.pdf',
      },
    ],
  },
]

export default function LeaseDetails() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Lease Records - ${mockAsset.name}`}
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
          {/* Asset Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Asset Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Asset Type</p>
                <p className="font-medium">{mockAsset.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{mockAsset.category}</p>
              </div>
            </div>
          </div>

          {/* Lease History */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Lease History</h2>
              <DataTable
                columns={columns}
                data={mockLeases}
                showFilters
                showDateFilter
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Comments</h2>
              <div className="space-y-4">
                {/* Comment Input */}
                <div className="flex gap-4">
                  <Input
                    placeholder="Add a comment..."
                    className="flex-1"
                  />
                  <Button>Post</Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {mockLeases[0].comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{comment.user}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(comment.date), 'PPp')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Lease Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Current Lease</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Lessor</p>
                  <p className="font-medium">{mockLeases[0].lessor_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">
                    {format(new Date(mockLeases[0].lease_start), 'PP')} -{' '}
                    {format(new Date(mockLeases[0].lease_end), 'PP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    $ {mockLeases[0].lease_amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{mockLeases[0].location.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Attachments</h3>
            <div className="space-y-3">
              {mockLeases[0].attachments.map((attachment, index) => (
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
                    ) : attachment.type === 'video' ? (
                      <div className="relative w-10 h-10">
                        <img
                          src={attachment.thumbnail}
                          alt={attachment.name}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                          <ImageIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
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

          {/* Map */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Location Map</h3>
              <div className="bg-gray-100 rounded-lg h-[200px] flex items-center justify-center">
                <p className="text-gray-500">Map integration goes here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}