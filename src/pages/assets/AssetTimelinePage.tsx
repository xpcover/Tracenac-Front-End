import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import { AssetTimeline } from '@/components/timeline/AssetTimeline'

// Mock data for an asset
const mockAsset = {
  id: 'LAP001',
  name: 'MacBook Pro 16"',
  type: 'Laptop',
  category: 'IT Equipment',
}

// Mock timeline events combining all types of records
const mockEvents = [
  {
    id: '1',
    type: 'history' as const,
    date: '2024-03-15T14:30:00Z',
    title: 'Maintenance Check',
    description: 'Regular maintenance check completed. All systems functioning normally.',
    user: 'John Doe',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    }
  },
  {
    id: '2',
    type: 'barcode' as const,
    date: '2024-03-15T12:00:00Z',
    title: 'Asset Verification',
    description: 'Barcode scan verified during inventory check',
    user: 'Jane Smith',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    },
    metadata: {
      barcode: '123456789',
      verification_status: 'verified'
    }
  },
  {
    id: '3',
    type: 'impairment' as const,
    date: '2024-03-14T09:00:00Z',
    title: 'Screen Damage Reported',
    description: 'Physical damage to screen detected during inspection',
    user: 'Mike Wilson',
    amount: 300.00,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
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
      }
    ]
  },
  {
    id: '4',
    type: 'lease' as const,
    date: '2024-03-01T10:00:00Z',
    title: 'Lease Agreement Updated',
    description: 'Monthly lease terms updated with new payment schedule',
    user: 'Sarah Johnson',
    amount: 1200.00,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    },
    attachments: [
      {
        type: 'document',
        url: '#',
        name: 'Lease Agreement.pdf',
      }
    ]
  },
  {
    id: '5',
    type: 'wip' as const,
    date: '2024-02-15T11:30:00Z',
    title: 'Upgrade Process Started',
    description: 'RAM upgrade and SSD replacement process initiated',
    user: 'Tech Team',
    status: 'In Progress',
    amount: 500.00,
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    }
  },
  {
    id: '6',
    type: 'usage' as const,
    date: '2024-02-01T08:00:00Z',
    title: 'Morning Shift Usage',
    description: 'Device used for software development tasks',
    user: 'Developer Team',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    },
    metadata: {
      hours: 8,
      shift: 'morning'
    }
  }
]

export default function AssetTimelinePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Timeline - ${mockAsset.name}`}
        description={`Asset ID: ${mockAsset.id}`}
      >
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
              <AssetTimeline
                events={mockEvents}
                onLocationClick={setSelectedLocation}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Asset Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1">{mockAsset.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1">{mockAsset.category}</dd>
              </div>
            </dl>
          </div>

          {/* Location Map */}
          {selectedLocation && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Selected Location</h3>
                <div className="bg-gray-100 rounded-lg h-[200px] flex items-center justify-center">
                  <p className="text-gray-500">Map integration goes here</p>
                </div>
                <div className="mt-4">
                  <p className="font-medium">{selectedLocation.address}</p>
                  <p className="text-sm text-gray-500">
                    {selectedLocation.latitude}, {selectedLocation.longitude}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}