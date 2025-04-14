import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Location } from '@/lib/types'
import LocationForm from './LocationForm'

const columnHelper = createColumnHelper<Location>()

const columns = [
  columnHelper.accessor('location_id', {
    header: 'Location ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('latitude', {
    header: 'Latitude',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('longitude', {
    header: 'Longitude',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updated_at', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data - In a real app, this would come from an API
const mockLocations: Location[] = [
  {
    location_id: '1',
    tenant_id: '1',
    location_name: 'Main Office',
    address: '123 Business St, City, Country',
    latitude: 40.7128,
    longitude: -74.0060,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    location_id: '2',
    tenant_id: '1',
    location_name: 'Warehouse',
    address: '456 Industrial Ave, City, Country',
    latitude: 40.7589,
    longitude: -73.9851,
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function LocationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleDelete = (location: Location) => {
    // In a real app, this would make an API call
    console.log('Delete location:', location)
  }

  return (
    <div>
      <PageHeader
        title="Locations"
        description="Manage asset locations and addresses"
        action={{
          label: 'Add Location',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockLocations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLocation(null)
        }}
        title={editingLocation ? 'Edit Location' : 'Add Location'}
      >
        <LocationForm
          location={editingLocation}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingLocation(null)
          }}
        />
      </Modal>
    </div>
  )
}