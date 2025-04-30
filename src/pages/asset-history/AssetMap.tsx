import { useState } from 'react'
import { MapPin, Navigation, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Input from '@/components/ui/Input'

interface Asset {
  id: string
  name: string
  type: string
  latitude: number
  longitude: number
  status: 'moving' | 'stationary'
  speed: number
  lastUpdated: string
}

// Mock data - In real app, this would come from real-time API
const mockAssets: Asset[] = [
  {
    id: 'TRUCK001',
    name: 'Delivery Truck 1',
    type: 'vehicle',
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'moving',
    speed: 45,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'FORK002',
    name: 'Forklift 2',
    type: 'equipment',
    latitude: 40.7589,
    longitude: -73.9851,
    status: 'stationary',
    speed: 0,
    lastUpdated: new Date().toISOString()
  }
]

export default function AssetMap() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAssets = mockAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Asset List */}
      <div className="w-80 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-4 border-b space-y-4">
          <h3 className="font-medium">Assets</h3>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {filteredAssets.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No assets found</p>
          ) : (
            filteredAssets.map(asset => (
              <div
                key={asset.id}
                className={`border-b hover:bg-gray-50 ${
                  selectedAsset?.id === asset.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <Link 
                        to={`/assets/${asset.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {asset.id}
                      </Link>
                    </div>
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        asset.status === 'moving'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {asset.status}
                    </button>
                  </div>
                  <div className="flex items-center justify-end">
                    <Link 
                      to={`/asset-history/${asset.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View History
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-white rounded-lg shadow">
        <div className="h-full p-4 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Map integration goes here (Google Maps/Mapbox)</p>
        </div>
      </div>

      {/* Analytics Panel */}
      {selectedAsset && (
        <div className="w-80 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Asset Analytics</h3>
              <Link
                to={`/assets/${selectedAsset.id}`}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="text-sm text-gray-500">Current Location</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <p>{selectedAsset.latitude}, {selectedAsset.longitude}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Current Speed</p>
              <div className="flex items-center gap-2 mt-1">
                <Navigation className="w-4 h-4 text-gray-400" />
                <p>{selectedAsset.speed} mph</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-1 capitalize">{selectedAsset.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="mt-1">
                {new Date(selectedAsset.lastUpdated).toLocaleString()}
              </p>
            </div>

            <div className="pt-4 border-t flex justify-between">
              <Link
                to={`/assets/${selectedAsset.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                Asset Details
              </Link>
              <Link
                to={`/asset-history/${selectedAsset.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                View History
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}