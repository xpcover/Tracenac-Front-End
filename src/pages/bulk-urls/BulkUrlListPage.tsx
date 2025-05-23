import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { Copy, QrCode, Plus } from 'lucide-react'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { QrCodeModal } from '../../components/modals/QrCodeModal'

interface ShortUrl {
  id: string
  longUrl: string
  shortUrl: string
  businessUnit: string
  location: string
  assetId: string | null
  assetName: string | null
  qrCode: boolean
  createdAt: string
  clicks: number
}

const columnHelper = createColumnHelper<ShortUrl>()

const columns = [
  columnHelper.accessor('shortUrl', {
    header: 'Image',
    cell: (info) => (
      <div className="flex items-center gap-2">
        <Link
          to={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          {info.getValue()}
        </Link>
        <button
          onClick={() => navigator.clipboard.writeText(info.getValue())}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy URL"
        >
          <Copy className="w-4 h-4" />
        </button>
        {info.row.original.qrCode && (
          <button
            onClick={() => info.table.options.meta?.onViewQrCode?.(info.getValue())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="View QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
        )}
      </div>
    ),
  }),
  columnHelper.accessor('longUrl', {
    header: 'PO Code',
    cell: (info) => (
      <span className="truncate max-w-xs block" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('assetId', {
    header: 'Asset Id',
    cell: (info) => info.row.original.assetId ? (
      <div>
        <div className="font-medium">{info.getValue()}</div>
        <div className="text-sm text-gray-500">{info.row.original.assetName}</div>
      </div>
    ) : '-',
  }),
  columnHelper.accessor('businessUnit', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Status',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Start Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('clicks', {
    header: 'Valid Till',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Total Scans',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockUrls: ShortUrl[] = [
  {
    id: '1',
    longUrl: 'https://example.com/very/long/url/that/needs/to/be/shortened/123',
    shortUrl: 'https://short.url/abc123',
    businessUnit: 'IT',
    location: 'HQ',
    assetId: 'LAP001',
    assetName: 'MacBook Pro 16"',
    qrCode: true,
    createdAt: '2024-03-15T10:00:00Z',
    clicks: 45,
  },
]


function BulkUrlListPage() {
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

    return (
      <div className="space-y-6">
        <PageHeader
          title="Bulk URLs"
          description="Create and manage bulk URLs for assets"
        >
          <div className="flex gap-2 mt-3">
            <Link
              to="/bulk-urls/create"
              className="inline-flex items-center justify-center h-10 px-6 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Bulk URL
            </Link>
          </div>
        </PageHeader>
  
        <DataTable
          columns={columns}
          data={mockUrls}
          meta={{
            onViewQrCode: (url: string) => setSelectedUrl(url),
          }}
        />
  
        {selectedUrl && (
          <QrCodeModal
            isOpen={true}
            onClose={() => setSelectedUrl(null)}
            url={selectedUrl}
          />
        )}
      </div>
    )
}

export default BulkUrlListPage
