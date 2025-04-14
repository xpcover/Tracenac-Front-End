import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, MapPin, User, Calendar, Barcode } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/Table'
import { createColumnHelper } from '@tanstack/react-table'
import Button from '@/components/ui/Button'

interface BarcodeScan {
  scan_id: string
  asset_id: string
  barcode_data: string
  scan_date: string
  scanned_by: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  verification_status: 'verified' | 'unverified' | 'failed'
  notes: string
}

const columnHelper = createColumnHelper<BarcodeScan>()

const columns = [
  columnHelper.accessor('scan_date', {
    header: 'Scan Date',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('scanned_by', {
    header: 'Scanned By',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-500" />
        <span>{info.getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor('location', {
    header: 'Location',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span>{info.getValue().address}</span>
      </div>
    ),
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
  columnHelper.accessor('notes', {
    header: 'Notes',
    cell: (info) => info.getValue() || '-',
  }),
]

// Mock data
const mockAsset = {
  id: 'LAP001',
  name: 'MacBook Pro 16"',
  barcode: '123456789',
  location: 'IT Department',
}

const mockScans: BarcodeScan[] = [
  {
    scan_id: '1',
    asset_id: 'LAP001',
    barcode_data: '123456789',
    scan_date: '2024-03-15T10:00:00Z',
    scanned_by: 'John Doe',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY',
    },
    verification_status: 'verified',
    notes: 'Regular verification scan',
  },
  {
    scan_id: '2',
    asset_id: 'LAP001',
    barcode_data: '123456789',
    scan_date: '2024-03-14T15:30:00Z',
    scanned_by: 'Jane Smith',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '456 Tech Ave, NY',
    },
    verification_status: 'verified',
    notes: 'Location change verification',
  },
]

export default function BarcodeScanDetails() {
  const { id } = useParams<{ id: string }>()
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Barcode Scans - ${mockAsset.name}`}
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
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Scan History</h2>
              <DataTable
                columns={columns}
                data={mockScans}
                showFilters
                showDateFilter
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Asset Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Barcode className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Barcode</p>
                  <p className="font-medium">{mockAsset.barcode}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Current Location</p>
                  <p className="font-medium">{mockAsset.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Scanned</p>
                  <p className="font-medium">
                    {format(new Date(mockScans[0].scan_date), 'PPp')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Location Map</h3>
              <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center">
                <p className="text-gray-500">Map integration goes here</p>
              </div>
              {selectedLocation && (
                <div className="mt-4">
                  <p className="font-medium">{selectedLocation.address}</p>
                  <p className="text-sm text-gray-500">
                    {selectedLocation.latitude}, {selectedLocation.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}