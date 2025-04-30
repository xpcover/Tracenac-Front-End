import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, MapPin, QrCode } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function CreateBarcodeScanPage() {
  const navigate = useNavigate()
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    navigate('/barcode-scans')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Barcode Scan"
        description="Record new barcode scan"
      >
        <Button variant="ghost" onClick={() => navigate('/barcode-scans')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Barcode Scans
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset ID
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Enter Asset ID"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Barcode Data
                </label>
                <div className="mt-1 flex gap-2">
                  <Input
                    type="text"
                    required
                    placeholder="Enter or scan barcode"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowScanner(true)}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scan Date
                </label>
                <Input type="datetime-local" required className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scanned By
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Enter name"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="use-location"
                  checked={useCurrentLocation}
                  onChange={(e) => setUseCurrentLocation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="use-location"
                  className="text-sm font-medium text-gray-700"
                >
                  Include Location
                </label>
              </div>

              {useCurrentLocation && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude
                    </label>
                    <Input type="number" step="any" className="mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude
                    </label>
                    <Input type="number" step="any" className="mt-1" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Input type="text" className="mt-1" />
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-2"
                      onClick={() => {
                        // Get current location
                      }}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Current Location
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter any additional notes"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/barcode-scans')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Scan Record</Button>
            </div>
          </form>
        </div>

        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Scan Barcode</h3>
                <button
                  onClick={() => setShowScanner(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <QrCode className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <p className="text-gray-500">Camera feed would go here</p>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowScanner(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}