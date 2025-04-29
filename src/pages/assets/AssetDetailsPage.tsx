import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { MapPin, Calendar, DollarSign, PenTool as Tool, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery } from '@tanstack/react-query'
import ApiService from '@/services/api.service'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'history', label: 'History' },
  { id: 'map', label: 'Location' },
] as const

// Mock data for asset history
const mockHistory = [
  {
    id: '1',
    date: '2024-03-15',
    type: 'maintenance',
    description: 'Regular maintenance check completed',
    technician: 'John Smith',
    cost: 150,
  },
  {
    id: '2',
    date: '2024-02-01',
    type: 'movement',
    description: 'Transferred to IT Department',
    by: 'Jane Doe',
    from: 'Storage',
    to: 'IT Department',
  },
]

export default function AssetDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('details')

  const {data, isLoading} = useQuery({
    queryKey: ['asset', id],
    queryFn: () => ApiService.get(`/assets/${id}`),
  })

  console.log("===>",data);
  
if(isLoading){
  return <h3 className='font-semibold'>Loading...</h3>
}

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Asset: ${data?.assetName}`}
        description={`Asset Code: ${data?.assetCode}`}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Tabs */}
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium">Basic Information</h3>
                      <dl className="mt-4 space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Type</dt>
                          <dd className="mt-1">{data?.assetType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Category</dt>
                          <dd className="mt-1">{data?.categoryId}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd className="mt-1">
                          <span className= {`px-2 py-1 text-xs rounded-full ${data?.status === "Active" ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"}`}>
                              {data?.status}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Department</dt>
                          <dd className="mt-1">{data?.departmentId}</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Financial Information</h3>
                      <dl className="mt-4 space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Purchase Cost</dt>
                          <dd className="mt-1 font-mono">
                            $ {data?.purchaseCost['$numberDecimal']}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Current Value</dt>
                          <dd className="mt-1 font-mono">
                          $ {data?.impairmentValue['$numberDecimal']}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Purchase Date</dt>
                          <dd className="mt-1">
                            {format(new Date(data?.purchaseDate), 'PP')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Warranty Until</dt>
                          <dd className="mt-1">
                            {format(new Date(data?.warrantyEndDate), 'PP')}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* <div>
                    <h3 className="text-lg font-medium">Maintenance Schedule</h3>
                    <dl className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Frequency</dt>
                        <dd className="mt-1">{data.maintenanceSchedule}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Maintenance</dt>
                        <dd className="mt-1">
                          {format(new Date(data.lastMaintenance), 'PP')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Next Maintenance</dt>
                        <dd className="mt-1">
                          {format(new Date(data.nextMaintenance), 'PP')}
                        </dd>
                      </div>
                    </dl>
                  </div> */}

                  <div>
                    <h3 className="text-lg font-medium">Notes</h3>
                    <p className="mt-2 text-gray-600">{data?.shiftUsageDetails?.notes}</p>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  {mockHistory.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        event.type === 'maintenance' 
                          ? 'bg-purple-100 text-purple-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {event.type === 'maintenance' ? (
                          <Tool className="w-5 h-5" />
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(event.date), 'PPp')} by{' '}
                          {event.type === 'maintenance' ? event.technician : event.by}
                        </p>
                        {event.type === 'movement' && (
                          <p className="text-sm text-gray-500 mt-1">
                            From: {event.from} → To: {event.to}
                          </p>
                        )}
                        {event.type === 'maintenance' && event.cost && (
                          <p className="text-sm text-gray-500 mt-1">
                            Cost: ${event.cost}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-4">
                  <div className="h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map integration goes here</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border space-y-2">
                    <h4 className="font-medium">Current Location</h4>
                    <p className="text-gray-600">{data?.address}</p>
                    <div className="text-sm text-gray-500">
                      Coordinates: {data?.location?.latitude}, {data?.location?.longitude}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Image */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={data?.image}
              alt={data?.assetName}
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow divide-y">
            <div className="p-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="font-medium">
                  {format(new Date(data?.purchaseDate), 'PP')}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="font-medium">
                  $ {data?.impairmentValue['$numberDecimal']}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <Tool className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Next Maintenance</p>
                <p className="font-medium">
                  {data?.nextMaintenance ? format(new Date(data?.nextMaintenance), 'PP') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{data?.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}