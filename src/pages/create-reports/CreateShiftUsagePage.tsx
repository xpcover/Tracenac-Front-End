import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function CreateShiftUsagePage() {
  const navigate = useNavigate()
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    navigate('/shift-usage')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Shift Usage"
        description="Record new shift usage"
      >
        <Button variant="ghost" onClick={() => navigate('/shift-usage')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shift Usage
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
                  Shift
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Input type="date" required className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Usage Hours
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  required
                  placeholder="Enter hours"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Operator ID
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Enter operator ID"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location ID
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Enter location ID"
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
                  Include GPS Location
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
                onClick={() => navigate('/shift-usage')}
              >
                Cancel
              </Button>
              <Button type="submit">Create Usage Record</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}