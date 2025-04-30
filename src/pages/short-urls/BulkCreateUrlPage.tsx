import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

// Mock data for dropdowns
const mockBusinessUnits = ['IT', 'HR', 'Finance', 'Operations']
const mockLocations = ['HQ', 'Branch A', 'Branch B', 'Warehouse']
const mockAssets = [
  { id: 'LAP001', name: 'MacBook Pro 16"' },
  { id: 'LAP002', name: 'Dell XPS 15' },
  { id: 'DSK001', name: 'HP Desktop PC' },
]

const QR_TEMPLATES = [
  { id: 'basic', name: 'Basic Template' },
  { id: 'branded', name: 'Branded Template' },
  { id: 'modern', name: 'Modern Design' },
  { id: 'minimal', name: 'Minimal Style' },
]

interface AssetUrlConfig {
  assetId: string
  urlCount: number
}

export default function BulkCreateUrlPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessUnit: '',
    location: '',
    generateQr: false,
    qrTemplate: 'basic',
  })

  const [assetConfigs, setAssetConfigs] = useState<AssetUrlConfig[]>([
    { assetId: '', urlCount: 1 }
  ])

  const addAssetConfig = () => {
    setAssetConfigs([...assetConfigs, { assetId: '', urlCount: 1 }])
  }

  const removeAssetConfig = (index: number) => {
    setAssetConfigs(assetConfigs.filter((_, i) => i !== index))
  }

  const updateAssetConfig = (index: number, field: keyof AssetUrlConfig, value: string | number) => {
    const newConfigs = [...assetConfigs]
    newConfigs[index] = {
      ...newConfigs[index],
      [field]: value
    }
    setAssetConfigs(newConfigs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would make an API call
    console.log('Create bulk URLs:', {
      ...formData,
      assetConfigs
    })
    navigate('/bulk-urls')
  }

  const totalUrls = assetConfigs.reduce((sum, config) => sum + config.urlCount, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk Create URL"
        description="Create multiple shortened URLs at once"
      >
        <Button variant="ghost" onClick={() => navigate('/bulk-urls')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bulk URLs
        </Button>
      </PageHeader>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="max-w-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Business Unit
                </label>
                <select
                  value={formData.businessUnit}
                  onChange={(e) => setFormData({ ...formData, businessUnit: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Business Unit</option>
                  {mockBusinessUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Location</option>
                  {mockLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Asset Configurations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Asset URLs</h3>
                  <Button
                    type="button"
                    onClick={addAssetConfig}
                    disabled={totalUrls >= 100}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>
                </div>

                {assetConfigs.map((config, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Asset {index + 1}</h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeAssetConfig(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Asset
                        </label>
                        <select
                          value={config.assetId}
                          onChange={(e) => updateAssetConfig(index, 'assetId', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Asset</option>
                          {mockAssets.map(asset => (
                            <option key={asset.id} value={asset.id}>
                              {asset.id} - {asset.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Number of URLs
                        </label>
                        <Input
                          type="number"
                          min="1"
                          max={100 - (totalUrls - config.urlCount)}
                          value={config.urlCount}
                          onChange={(e) => updateAssetConfig(index, 'urlCount', parseInt(e.target.value))}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <p className="text-sm text-gray-500">
                  Total URLs to generate: {totalUrls} (Maximum 100)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bulk-generate-qr"
                    checked={formData.generateQr}
                    onChange={(e) => setFormData({ ...formData, generateQr: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="bulk-generate-qr" className="text-sm text-gray-700">
                    Generate QR Codes
                  </label>
                </div>

                {formData.generateQr && (
                  <div className="pl-6">
                    <label className="block text-sm font-medium text-gray-700">
                      QR Code Template
                    </label>
                    <select
                      value={formData.qrTemplate}
                      onChange={(e) => setFormData({ ...formData, qrTemplate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {QR_TEMPLATES.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button type="submit" className="px-6">Create URLs</Button>
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
    </div>
  )
}