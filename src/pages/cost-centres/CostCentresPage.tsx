import { useState,useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { CostCentre } from '@/lib/types'
import CostCentreForm from './CostCentreForm'
import axios from 'axios'

const columnHelper = createColumnHelper<CostCentre>()

const columns = [
  columnHelper.accessor('cost_centre_id', {
    header: 'Cost Centre ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cost_centre_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
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


export default function CostCentresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCostCentre, setEditingCostCentre] = useState<CostCentre | null>(null)
  const [costCenter , setCostCenter] = useState<CostCentre[]>([])


  const fetchCostCenter=async()=>{
    const token = localStorage.getItem("token")
    if(!token){
      console.error("No Token found");
      return
    }
    // const locationData={
    //   tenantId:localStorage.getItem("tenantId"),
    // }

    try{
      const response = await axios.get(`http://localhost:4000/api/department/cost-center/${localStorage.getItem("tenantId")}`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if(!response.status === true){
        throw new Error("Failed to Feth Cost-center");
      }

      const data =  await response.data
      console.log("Feth Cost-center", data);

      const mappedCostCenter = data.msg.map((costcenter:any)=>({
        cost_centre_id:costcenter._id,
        tenant_id: costcenter.tenantId,
        cost_centre_name:costcenter.costCentreName,
        description: costcenter.description,
        created_at: costcenter.created_at,
        updated_at: costcenter.updated_at
      }))
      setCostCenter(mappedCostCenter)
    }catch(error){
      console.error("Error fetching Cost-center",error)
    }
  }

  console.log("Cost-center", costCenter)


  // export interface CostCentre {
  //   cost_centre_id: string
  //   tenant_id: string
  //   cost_centre_name: string
  //   description: string
  //   created_at: string
  //   updated_at: string
  // }


  const handleAddCostCenter = async(data:any)=>{
    console.log("Cost Center",data)
    const costCenterData={
      tenantId:localStorage.getItem("tenantId"),
      costCentreName: data.cost_centre_name,
      description: data.description,
    }
    console.log("Cost Center",costCenterData)
    try{
      const token = localStorage.getItem("token")
      if(!token){
        console.error("No token found");
        return
      }

      const response = await axios.post("http://localhost:4000/api/department/cost-center/",costCenterData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      console.log("Added CostCenter", response.data)
      // fetchCostCenter()
      if(response.data.status === true){
        fetchCostCenter()
      }
    }catch(error){
      console.error("Error Adding CostCenter", error)
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
    fetchCostCenter()
  },[])

  const handleEditCostCenter = (data: any) => {
      console.log('Edit user:', data)
      setEditingCostCentre(data)
      setIsModalOpen(true)
  }

  const handleDeleteCostCenter = async(costCenter:CostCentre) =>{
    console.log("Cost-center", costCenter)
    try{
      await axios.delete(`http://localhost:4000/api/department/cost-center/${costCenter.cost_centre_id}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setCostCenter((prevCostCenter)=>prevCostCenter.filter((p)=>p.cost_centre_id !== costCenter.cost_centre_id))
    }catch(error){
      console.error('Error deleting role:', error)
    }
  }

  return (
    <div>
      <PageHeader
        title="Cost Centres"
        description="Manage cost centres for financial tracking"
        action={{
          label: 'Add Cost Centre',
          onClick: () => setIsModalOpen(true),
        }}
      />

      {costCenter.length === 0?(
          <p className="text-center text-gray-500 mt-4">No Cost Center available</p>
      ):(
        <DataTable
        columns={columns}
        data={costCenter}
        onEdit={handleEditCostCenter }
        onDelete={handleDeleteCostCenter}
      />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCostCentre(null)
        }}
        title={editingCostCentre ? 'Edit Cost Centre' : 'Add Cost Centre'}
      >
        <CostCentreForm
          costCentre={editingCostCentre}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            if(data){
              handleEditCostCenter(data)
              handleAddCostCenter(data)
            }
            setIsModalOpen(false)
            setEditingCostCentre(null)
          }}
        />
      </Modal>
    </div>
  )
}