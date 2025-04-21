import { useState,useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Location } from '@/lib/types'
import LocationForm from './LocationForm'
import axios from 'axios'

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
  const [location, setLocation] = useState<Location[]>([])

  const fetchLocation=async()=>{
    const token = localStorage.getItem("token")
    if(!token){
      console.error("No Token found");
      return
    }
    // const locationData={
    //   tenantId:localStorage.getItem("tenantId"),
    // }

    try{
      const response = await axios.get(`http://localhost:4000/api/department/location/${localStorage.getItem("tenantId")}`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if(!response.status === true){
        throw new Error("Failed to Feth Departments");
      }

      const data =  await response.data
      console.log("Feth Departments", data);

      const mappedLocation = data.msg.map((loc:any)=>({
        location_id:loc._id,
        tenantId: loc.tenantId,
        location_name:loc.location_name,
        latitude: loc.latitude,
        address:loc.address,
        longitude:loc.longitude,
        created_at: loc.createdAt,
        updated_at: loc.updatedAt
      }))
      setLocation(mappedLocation)
    }catch(error){
      console.error("Error fetching Department",error)
    }
  }

  const handleAddLocation = async(data:any)=>{
    console.log(data)
    const LocationData={
      tenantId:localStorage.getItem("tenantId"),
      location_name: data.location_name,
      address:data.address,
      latitude:data.latitude,
      longitude: data.longitude
    }
    console.log("Location",LocationData)
    try{
      const token = localStorage.getItem("token")
      if(!token){
        console.error("No token found");
        return
      }

      const response = await axios.post("http://localhost:4000/api/department/location/",LocationData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      console.log("Added Location", response.data)
      if(response.data.status === true){
        fetchLocation()
      }
    }catch(error){
      console.error("Error Adding Department", error)
    }
  }

  // export interface Location {
  //   location_id: string
  //   tenant_id: string
  //   location_name: string
  //   address: string
  //   latitude: number
  //   longitude: number
  //   created_at: string
  //   updated_at: string
  // }

  console.log("Location", location)

  useEffect(()=>{
    fetchLocation()
  },[])


  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setIsModalOpen(true)
  }
  const handleDelete = async (location: Location) => {
    // In a real app, this would make an API call
    console.log('Delete department:', location)
    try{
      await axios.delete(`http://localhost:4000/api/department/location/${location.location_id}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("token")}`,
        },
      })
      setLocation((prevLoc)=>prevLoc.filter((loc)=>loc.location_id !== location.location_id))
    }catch(error){
      console.error("Error deleting department", error)
    }
  }
  
  return (
    <div>
      <PageHeader
        title="Locations"
        description="Manage asset locations and addresses"
        action={{
          label: "Add Location",
          onClick: () => setIsModalOpen(true),
        }}
      />

      {location.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No Locations available</p>
      ) : (
        <DataTable
          columns={columns}
          data={location}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        title={editingLocation ? "Edit Location" : "Add Location"}
      >
        <LocationForm
          location={editingLocation}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log("Form submitted:", data);
            setIsModalOpen(false);
            setEditingLocation(null);
            handleAddLocation(data);
          }}
        />
      </Modal>
    </div>
  );
}