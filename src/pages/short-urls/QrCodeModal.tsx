import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  showCustomization?: boolean
}

const QR_LAYOUTS = [
  { id: 'default', name: 'Default' },
  { id: 'rounded', name: 'Rounded' },
  { id: 'dots', name: 'Dots' },
]

const QR_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#0066CC' },
  { name: 'Red', value: '#CC0000' },
  { name: 'Green', value: '#008800' },
  { name: 'Purple', value: '#660099' },
]

const QR_BACKGROUNDS = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Light Gray', value: '#F5F5F5' },
  { name: 'Light Blue', value: '#F0F7FF' },
  { name: 'Light Green', value: '#F0FFF4' },
  { name: 'Light Yellow', value: '#FFFFF0' },
]

export function QrCodeModal({ isOpen, onClose, url, showCustomization = true }: QrCodeModalProps) {
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [layout, setLayout] = useState('default')
  const [size, setSize] = useState(300)
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDownload = (format: 'svg' | 'png' | 'pdf') => {
    // In a real app, this would make an API call to generate and download the QR code
    console.log('Download QR code:', { format, color, bgColor, layout, size, logo })
  }

  const getQrCodeUrl = () => {
    const params = new URLSearchParams({
      size: `${size}x${size}`,
      data: url,
      bgcolor: bgColor.slice(1),
      color: color.slice(1),
      qzone: '1',
      format: 'svg',
    })

    if (layout === 'rounded') {
      params.append('shape', 'circle')
    } else if (layout === 'dots') {
      params.append('pattern', 'dots')
    }

    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Code"
      actions={showCustomization ? (
        <>
          <Button variant="secondary" onClick={() => handleDownload('svg')}>
            Download SVG
          </Button>
          <Button variant="secondary" onClick={() => handleDownload('png')}>
            Download PNG
          </Button>
          <Button variant="secondary" onClick={() => handleDownload('pdf')}>
            Download PDF
          </Button>
        </>
      ) : undefined}
    >
      {showCustomization ? (
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customize</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Layout
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {QR_LAYOUTS.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Size (px)
                  </label>
                  <Input
                    type="number"
                    min="100"
                    max="1000"
                    step="50"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {QR_COLORS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setColor(c.value)}
                        className={`w-full aspect-square rounded-lg border-2 ${
                          color === c.value ? 'border-blue-500' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {QR_BACKGROUNDS.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setBgColor(c.value)}
                        className={`w-full aspect-square rounded-lg border-2 ${
                          bgColor === c.value ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Logo (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-gray-100 file:text-gray-700
                      hover:file:bg-gray-200"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Recommended size: 100x100px, PNG or SVG
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <div className="relative">
                <img
                  src={getQrCodeUrl()}
                  alt="QR Code Preview"
                  className="max-w-full"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/4 object-contain"
                  />
                )}
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 break-all">
              URL: {url}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <img
              src={getQrCodeUrl()}
              alt="QR Code"
              className="max-w-full"
              style={{ width: size, height: size }}
            />
          </div>
          <p className="text-sm text-gray-500 break-all">
            URL: {url}
          </p>
        </div>
      )}
    </Modal>
  )
}