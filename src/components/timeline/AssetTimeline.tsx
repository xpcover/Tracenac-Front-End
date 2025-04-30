import { format } from 'date-fns'
import { 
  History, 
  Barcode, 
  TrendingDown, 
  KeyRound, 
  Construction, 
  Clock,
  MapPin,
  User,
  DollarSign,
  FileText,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'history' | 'barcode' | 'impairment' | 'lease' | 'wip' | 'usage'
  date: string
  title: string
  description: string
  user: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  amount?: number
  status?: string
  attachments?: {
    type: 'image' | 'document' | 'video'
    url: string
    name: string
    thumbnail?: string
  }[]
  metadata?: Record<string, any>
}

interface AssetTimelineProps {
  events: TimelineEvent[]
  onLocationClick?: (location: { latitude: number; longitude: number; address: string }) => void
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'history':
      return <History className="w-5 h-5" />
    case 'barcode':
      return <Barcode className="w-5 h-5" />
    case 'impairment':
      return <TrendingDown className="w-5 h-5" />
    case 'lease':
      return <KeyRound className="w-5 h-5" />
    case 'wip':
      return <Construction className="w-5 h-5" />
    case 'usage':
      return <Clock className="w-5 h-5" />
  }
}

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'history':
      return 'bg-blue-100 text-blue-600'
    case 'barcode':
      return 'bg-purple-100 text-purple-600'
    case 'impairment':
      return 'bg-red-100 text-red-600'
    case 'lease':
      return 'bg-green-100 text-green-600'
    case 'wip':
      return 'bg-orange-100 text-orange-600'
    case 'usage':
      return 'bg-yellow-100 text-yellow-600'
  }
}

export function AssetTimeline({ events, onLocationClick }: AssetTimelineProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className={`relative px-1 ${getEventColor(event.type)} rounded-full`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">
                        {event.title}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {format(new Date(event.date), 'PPp')} by {event.user}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    <p>{event.description}</p>
                  </div>

                  {/* Additional Metadata */}
                  <div className="mt-2 space-y-2">
                    {event.location && (
                      <button
                        onClick={() => onLocationClick?.(event.location!)}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {event.location.address}
                      </button>
                    )}

                    {event.amount && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {event.amount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </div>
                    )}

                    {event.status && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="mr-1.5 h-4 w-4 flex-shrink-0" />
                        {event.status}
                      </div>
                    )}

                    {/* Attachments */}
                    {event.attachments && event.attachments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-4">
                        {event.attachments.map((attachment, index) => (
                          <div key={index} className="relative">
                            {attachment.type === 'image' ? (
                              <img
                                src={attachment.thumbnail || attachment.url}
                                alt=""
                                className="h-32 w-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => window.open(attachment.url, '_blank')}
                              />
                            ) : attachment.type === 'video' ? (
                              <div 
                                className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => window.open(attachment.url, '_blank')}
                              >
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            ) : (
                              <div 
                                className="h-32 w-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                onClick={() => window.open(attachment.url, '_blank')}
                              >
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                            <span className="mt-1 text-xs text-gray-500 block truncate">
                              {attachment.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}