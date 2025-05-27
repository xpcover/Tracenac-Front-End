import { useState } from 'react'
import { Link } from 'react-router-dom'
  import { createColumnHelper } from '@tanstack/react-table'
import { Copy, QrCode, Plus, ArrowDown } from 'lucide-react'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { QrCodeModal } from '../../components/modals/QrCodeModal'
import Button from '@/components/ui/Button'

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
  columnHelper.accessor('id', {
    header: 'NO.',
    cell: (info) => (
      <span className="truncate max-w-xs block">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('longUrl', {
    header: 'View More',
    cell: () => (
      <span className="truncate max-w-xs block">
        <ArrowDown />
      </span>
    ),
  }),
  columnHelper.accessor('shortUrl', {
    header: 'Short URL Details',
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
  columnHelper.accessor('businessUnit', {
    header: 'Date',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Engagement',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('action', {
    header: 'Action',
    cell: (info) => <>
      <div>
        <Button>
          <IoCopyOutline />
        </Button>
        <Button>
          <VscShare />
        </Button>
        <Button></Button>
      </div>
    </>,
  }),
]

export default function ShortUrlsPage() {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Short   URLs"
        description="Create and manage shortened URLs for assets"
      >
        <div className="flex gap-2 mt-3">
          <Link
            to="/short-urls/create"
            className="inline-flex items-center justify-center h-10 px-6 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Short URL
          </Link>
        </div>
      </PageHeader>

      <DataTable
        columns={columns}
        // url="/shortcode/url-shortner"
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