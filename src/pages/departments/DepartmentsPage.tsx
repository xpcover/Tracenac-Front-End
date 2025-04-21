import { useState,useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Department } from '@/lib/types'
import DepartmentForm from './DepartmentForm'
import axios from 'axios'

const columnHelper = createColumnHelper<Department>()

const columns = [
  columnHelper.accessor('department_id', {
    header: 'Department ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('department_name', {
    header: 'Name',
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
const mockDepartments: Department[] = [
  {
    department_id: '1',
    tenant_id: '1',
    department_name: 'IT Department',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    department_id: '2',
    tenant_id: '1',
    department_name: 'Human Resources',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function DepartmentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [department, setDepartment] = useState<Department[]>([])

  const fetchDepartments=async()=>{
    const token = localStorage.getItem("token")
    if(!token){
      console.error("No Token found");
      return
    }

    try{
      const response = await axios.get('http://localhost:4000/api/department/departments',{
        headers:{
          "Authorization":`Bearer ${token}`
        }
      });
      if(!response.status === true){
        throw new Error("Failed to Feth Departments");
      }

      const data =  await response.data
      console.log("Feth Departments", data);

      const mappedDepartment = data.map((depart:any)=>({
        department_id:depart._id,
        tenantId: depart.tenantId,
        department_name:depart.departmentName,
        created_at: depart.createdAt,
        updated_at: depart.updatedAt
      }))
      setDepartment(mappedDepartment)
    }catch(error){
      console.error("Error fetching Department",error)
    }
  }

  console.log("Department", department)

  useEffect(()=>{
    fetchDepartments()
  },[])


  // export interface Department {
  //   department_id: string
  //   tenant_id: string
  //   department_name: string
  //   created_at: string
  //   updated_at: string
  // }

  const handleEdit = (department: data) => {
    setEditingDepartment(department)
    setIsModalOpen(true)
  }

  const handleDelete = async (department: Department) => {
    // In a real app, this would make an API call
    console.log('Delete department:', department)
    try{
      await axios.delete(`http://localhost:4000/api/department/departments/${department.department_id}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem("token")}`,
        },
      })
      setDepartment((prevDepar)=>prevDepar.filter((dep)=>dep.department_id !== department.department_id))
    }catch(error){
      console.error("Error deleting department", error)
    }
  }

  const handleAddDepartment  = async(data:any)=>{
    console.log(data)
    const departmentData={
      tenantId:localStorage.getItem("tenantId"),
      departmentName:data.department_name
    }
    console.log("Department",departmentData)
    try{
      const token = localStorage.getItem("token")
      if(!token){
        console.error("No token found");
        return
      }

      const response = await axios.post("http://localhost:4000/api/department/departments/",departmentData,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      console.log("Added Department",response.data)
      if(response.data.status === true){
        fetchDepartments()
      }
    }catch(error){
      console.error("Error Adding Department", error)
    }
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage organizational departments"
        action={{
          label: 'Add Department',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={department}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingDepartment(null)
        }}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
      >
        <DepartmentForm
          department={editingDepartment}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingDepartment(null)
            if(editingDepartment){
              handleEdit(data)
            }else{
              handleAddDepartment(data)
            }
          }}
        />
      </Modal>
    </div>
  )
}