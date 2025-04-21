import { useState,useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ForexRateForm from './ForexRateForm'
import axios from 'axios'


interface ForexRate {
  rate_id: string
  tenant_id: string
  currency_code: string
  date: string
  exchange_rate: number
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<ForexRate>()

const columns = [
  columnHelper.accessor('currency_code', {
    header: 'Currency',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('exchange_rate', {
    header: 'Exchange Rate',
    cell: (info) => {
      const value = info.getValue();
      return (
        <span className="font-mono">
          {typeof value === 'number'
            ? value.toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })
            : 'N/A'}
        </span>
      );
    },
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

// Mock data
const mockRates: ForexRate[] = [
  {
    rate_id: '1',
    tenant_id: '1',
    currency_code: 'EUR',
    date: '2024-03-15',
    exchange_rate: 1.0865,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    rate_id: '2',
    tenant_id: '1',
    currency_code: 'GBP',
    date: '2024-03-15',
    exchange_rate: 1.2734,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
]

export default function ForexRatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRate, setEditingRate] = useState<ForexRate | null>(null)
  const [forex,setForex]  =useState<ForexRate[]>([])

  const fetchForexRate=async()=>{
    const token = localStorage.getItem("token")
    if(!token){
      console.error("No Token found");
      return
    }
    // const locationData={
    //   tenantId:localStorage.getItem("tenantId"),
    // }

    try{
      const response = await axios.get(`http://localhost:4000/api/department/forexRate`,{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if(!response.data.status === true){
        throw new Error("Failed to Feth Forex");
      }

      const data =  await response.data
      console.log("Feth Forex", data);

      // rate_id: string
      // tenant_id: string
      // currency_code: string
      // date: string
      // exchange_rate: number
      // created_at: string
      // updated_at: string

      const mappedForex = data.msg.map((rate:any)=>({
        rate_id:rate._id,
        tenant_id: rate.tenantId,
        currency_code: rate.currency_code,
        date:rate.date,
        created_at: rate.createdAt,
        updated_at: rate.updatedAt
      }))
      setForex(mappedForex)
    }catch(error){
      console.error("Error fetching  Forex",error)
    }
  }

  console.log("Forex",forex)

  useEffect(()=>{
    fetchForexRate()
  },[])

  const handleEdit = (rate: ForexRate) => {
    setEditingRate(rate)
    setIsModalOpen(true)
  }
  // rate_id:rate._id,
  // tenantId: rate.tenantId,
  // current_code: rate.currency_code,
  // date:rate.data,
  const handleAddForexRate = async(data:any)=>{
    console.log(data)
    const ForexData={
      tenantId:localStorage.getItem("tenantId"),
      currency_code: data.currency_code,
      exchange_rate:data.exchange_rate,
      date:data.date
    }
    console.log("Forex",ForexData)
    try{
      const token = localStorage.getItem("token")
      if(!token){
        console.error("No token found");
        return
      }

      const response = await axios.post("http://localhost:4000/api/department/forexRate", ForexData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      fetchForexRate()
      console.log("Added Forex", response.data)
      // if(response.data.status === true){
      //   fetchForexRate()
      // }
    }catch(error){
      console.error("Error Adding Forex", error)
    }
  }

  const handleDelete = async (forex: any) => {
    // In a real app, this would make an API call
    console.log('Delete Forex:', forex)
    try{
      await axios.delete(`http://localhost:4000/api/department/forexRate/${forex.rate_id}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("token")}`,
        },
      })
      setForex((prevForex) => prevForex.filter((rate) => rate.rate_id !== forex.rate_id));
    }catch(error){
      console.error("Error deleting department", error)
    }
  }


  return (
    <div>
      <PageHeader
        title="Forex Rates"
        description="Manage currency exchange rates"
        action={{
          label: 'Add Rate',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={forex}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRate(null)
        }}
        title={editingRate ? 'Edit Rate' : 'Add Rate'}
      >
        <ForexRateForm
          rate={editingRate}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            handleAddForexRate(data)
            setIsModalOpen(false)
            setEditingRate(null)
          }}
        />
      </Modal>
    </div>
  )
}