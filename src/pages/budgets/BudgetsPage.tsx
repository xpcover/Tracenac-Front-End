import { useState,useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import BudgetForm from './BudgetForm'
import axios from 'axios'

interface Budget {
  budget_id: string
  tenant_id: string
  assest_id: string
  fiscal_year: string
  budget_amount: number
  actual_amount: number
  variance: number
  created_at: string
  updated_at: string
  created_by: string
}

const columnHelper = createColumnHelper<Budget>()

const columns = [
  columnHelper.accessor('assest_id', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fiscal_year', {
    header: 'Fiscal Year',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('budget_amount', {
    header: 'Budget',
    cell: (info) => (
      <span className="font-mono">
        ${' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('actual_amount', {
    header: 'Actual',
    cell: (info) => (
      <span className="font-mono">
        ${' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('variance', {
    header: 'Variance',
    cell: (info) => {
      const variance = info.getValue()
      return (
        <span
          className={`font-mono ${
            variance < 0
              ? 'text-red-600'
              : variance > 0
              ? 'text-green-600'
              : 'text-gray-600'
          }`}
        >
          ${' '}
          {variance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: 'always',
          })}
        </span>
      )
    },
  }),
  columnHelper.accessor('created_by', {
    header: 'Created By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockBudgets: Budget[] = [
  {
    budget_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    fiscal_year: '2024',
    budget_amount: 3000,
    actual_amount: 2800,
    variance: 200,
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    budget_id: '2',
    tenant_id: '1',
    asset_id: 'SRV001',
    fiscal_year: '2024',
    budget_amount: 5000,
    actual_amount: 5500,
    variance: -500,
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-01T11:00:00Z',
    updated_at: '2024-01-01T11:00:00Z',
  },
]

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [budget,setBudget] = useState<Budget[]>([])

  const fetchBudget=async()=>{
    const token = localStorage.getItem("token")
    if(!token){
      console.error("No Token found");
      return
    }
    // const locationData={
    //   tenantId:localStorage.getItem("tenantId"),
    // }

    try{
      const response = await axios.get("http://localhost:4000/api/department/budget",{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if(!response.data.status === true){
        throw new Error("Failed to Feth Budget");
      }

      const data =  await response.data
      console.log("Feth Budget", data);

      // budget_id: string
      // tenant_id: string
      // asset_id: string
      // fiscal_year: string
      // budget_amount: number
      // actual_amount: number
      // variance: number
      // created_at: string
      // updated_at: string

      const mappedBudget = data.msg.map((budget:any)=>({
        budget_id:budget._id,
        tenant_id: budget.tenantId,
        assest_id:budget.assest_id,
        fiscal_year:budget.fiscal_year,
        budget_amount: budget.budget_amount,
        actual_amount: budget.actual_amount,
        variance:budget.variance,
        created_at: budget.createdAt,
        created_by:budget.createdBy,
        updated_at: budget.updatedAt
      }))
      setBudget(mappedBudget)
    }catch(error){
      console.error("Error fetching Budget",error)
    }
  }
  console.log("Budget",budget)

  useEffect(()=>{
    fetchBudget()
  },[])

  const handleEdit = (rate: Budget) => {
    setEditingBudget(rate)
    setIsModalOpen(true)
  }

  const handleAddBudget = async(data:any)=>{
    console.log(data)
    const budgetData={
      tenantId:localStorage.getItem("tenantId"),
      assest_id: data.assest_id,
      fiscal_year:data.fiscal_year,
      budget_amount: data.budget_amount,
      actual_amount: data.actual_amount,
      variance:data.variance,
      createdBy: localStorage.getItem("userId")
    }
    console.log("Budget", budgetData)
    try{
      const token = localStorage.getItem("token")
      if(!token){
        console.error("No token found");
        return
      }

      const response = await axios.post("http://localhost:4000/api/department/budget",budgetData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if(response.data.status === true){
        fetchBudget()
      }
      console.log("Added Budget", response.data)
    }catch(error){
      console.error("Error Adding Budget", error)
    }
  }

  const handleDelete = async (budgetToDelete: any) => {
    try {
      console.log('Deleting Budget:', budgetToDelete);
  
      await axios.delete(`http://localhost:4000/api/department/budget/${budgetToDelete.budget_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      // Remove the deleted budget from the state
      setBudget((prevBudgets) => prevBudgets.filter(
        (budget) => budget.budget_id !== budgetToDelete.budget_id
      ));
  
      console.log('Budget deleted successfully');
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };
  

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Manage asset budgets and track variances"
        action={{
          label: 'Add Budget',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={budget}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBudget(null)
        }}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          budget={editingBudget}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            handleAddBudget(data)
            setIsModalOpen(false)
            setEditingBudget(null)
          }}
        />
      </Modal>
    </div>
  )
}