import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, FileText, Image, MapPin, MessageSquare, Video } from 'lucide-react'
import Button from '@/components/ui/Button'
import AssetMap from './AssetMap'

interface HistoryEntry {
  id: string
  date: string
  type: 'text' | 'image' | 'video'
  content: string
  user: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  media?: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }[]
}

// Mock data - In a real app, this would come from an API
const mockAsset = {
  id: 'LAP001',
  name: 'MacBook Pro 16"',
  category: 'Laptops',
  status: 'Active',
  purchaseDate: '2024-01-15',
  location: 'IT Department',
  lastMaintenance: '2024-03-10',
}

const mockHistoryEntries: HistoryEntry[] = [
  {
    id: '1',
    date: '2024-03-15T14:30:00Z',
    type: 'text',
    content: 'Regular maintenance check completed. All systems functioning normally.',
    user: 'John Doe',
    location: {
      latitude: 40.7128,
      longitude: -74.006,
      address: '123 Business St, NY'
    }
  },
  {
    id: '2',
    date: '2024-03-15T12:00:00Z',
    type: 'image',
    content: 'Inspection photos from quarterly maintenance',
    user: 'Jane Smith',
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200'
      }
    ]
  },
  {
    id: '3',
    date: '2024-03-14T09:00:00Z',
    type: 'video',
    content: 'Video recording of the maintenance procedure',
    user: 'Mike Wilson',
    media: [
      {
        type: 'video',
        url: 'https://example.com/maintenance-video.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200'
      }
    ]
  }
]

const TABS = [
  { id: 'details', label: 'Asset Details' },
  { id: 'history', label: 'History Timeline' },
  { id: 'map', label: 'Asset Map' },
] as const

interface AssetHistoryDetailsProps {
  assetId: string
}

export default function AssetHistoryDetails({ assetId }: AssetHistoryDetailsProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('details')

  const getIcon = (type: 'text' | 'image' | 'video') => {
    switch (type) {
      case 'text':
        return <MessageSquare className="w-5 h-5" />
      case 'image':
        return <Image className="w-5 h-5" />
      case 'video':
        return <Video className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/asset-history')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Asset History - {assetId}</h1>
            <p className="text-sm text-gray-500">View detailed history and information</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="-mb-px flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-6 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
                    <dd className="mt-1">{mockAsset.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1">{mockAsset.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1">{mockAsset.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {mockAsset.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Location & Maintenance</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Location</dt>
                    <dd className="mt-1">{mockAsset.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                    <dd className="mt-1">{format(new Date(mockAsset.purchaseDate), 'PP')}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Maintenance</dt>
                    <dd className="mt-1">{format(new Date(mockAsset.lastMaintenance), 'PP')}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {mockHistoryEntries.map((entry, entryIdx) => (
                  <li key={entry.id}>
                    <div className="relative pb-8">
                      {entryIdx !== mockHistoryEntries.length - 1 ? (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className={`relative px-1 ${
                          entry.type === 'text' ? 'bg-blue-100' :
                          entry.type === 'image' ? 'bg-green-100' : 'bg-purple-100'
                        } rounded-full`}>
                          {getIcon(entry.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {entry.user}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {format(new Date(entry.date), 'PPp')}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{entry.content}</p>
                          </div>
                          {entry.location && (
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                              {entry.location.address}
                            </div>
                          )}
                          {entry.media && entry.media.length > 0 && (
                            <div className="mt-4 flex space-x-4">
                              {entry.media.map((media, index) => (
                                <div key={index} className="relative">
                                  {media.type === 'image' ? (
                                    <img
                                      src={media.thumbnail || media.url}
                                      alt=""
                                      className="h-32 w-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                      onClick={() => window.open(media.url, '_blank')}
                                    />
                                  ) : (
                                    <div 
                                      className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                      onClick={() => window.open(media.url, '_blank')}
                                    >
                                      <Video className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-[600px]">
              <AssetMap />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}