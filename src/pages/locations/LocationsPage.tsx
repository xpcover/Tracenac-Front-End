import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Location } from '@/lib/types'
import LocationForm from './LocationForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const columnHelper = createColumnHelper<Location>()

const columns = [
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
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data - In a real app, this would come from an API

export default function LocationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [viewLocation, setViewLocation] = useState<Location | null>(null)

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Department deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/location'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });


  const handleEdit = (location:Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }

  const handleDelete = (location: Location) => {
    deleteMutation.mutate(`/department/location/${location?._id}`)
  }

  const handleView = (location:Location) =>{
    setViewLocation(location)
    setIsModalOpen(true)
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
        url="/department/location"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView = {handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingLocation(null)
          setViewLocation(null)
        }}
        title={
          viewLocation
            ? 'View Location' // 👈 Set title for view mode
            : editingLocation
            ? 'Edit Location'
            : 'Add Location'
        }
      >
        
        <LocationForm
          location={editingLocation}
          setIsModalOpen={setIsModalOpen}
          viewLocation = {viewLocation}
        />
      </Modal>
    </div>
  )
}