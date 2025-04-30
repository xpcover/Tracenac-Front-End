import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { QrCodeModal } from './QrCodeModal'

export default function CreateShortUrlPage() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [generateQr, setGenerateQr] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (generateQr) {
      setShowQrModal(true)
    } else {
      // In a real app, this would make an API call
      console.log('Create single URL:', { url, generateQr })
      navigate('/short-urls')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Short URL"
        description="Create a single shortened URL"
      >
        <Button variant="ghost" onClick={() => navigate('/short-urls')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Short URLs
        </Button>
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="max-w-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  URL to Shorten
                </label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/long/url"
                  required
                  className="mt-1"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Enter the URL you want to shorten. The URL must start with http:// or https://.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generate-qr"
                  checked={generateQr}
                  onChange={(e) => setGenerateQr(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="generate-qr" className="text-sm text-gray-700">
                  Generate QR Code
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button type="submit" className="px-6">Create Short URL</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/short-urls')}
                className="px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>

      {showQrModal && (
        <QrCodeModal
          isOpen={true}
          onClose={() => {
            setShowQrModal(false)
            navigate('/short-urls')
          }}
          url={url}
        />
      )}
    </div>
  )
}