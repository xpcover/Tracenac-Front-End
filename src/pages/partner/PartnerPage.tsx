import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Partner, User } from '@/lib/types'
import  PartnerForm from './PartnerForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/config/axiosInstance'


const columnHelper = createColumnHelper<Partner>()
// PartnerID, Partner Name, category, city, pincode, email, Phone, country, company, actions

const columns = [
  columnHelper.accessor("partnerName",{
    header: "Partner Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("partnerCategory",{
    header:"Category",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("city",{
    header:"City",
    cell: (info)=>info.getValue(),
  }),
  columnHelper.accessor("pincode",{
    header:"Pincode",
    cell:(info)=>info.getValue(),
  }),
  columnHelper.accessor("partnerUserEmailId",{
    header:"Email",
    cell:(info)=>info.getValue()
  }),
  columnHelper.accessor("partnerAppUserPhoneNo",{
    header:"Phone",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("country",{
    header:"Country",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor("company",{
    header:"Company",
    cell: (info)=> info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function PartnerPage(){
  const [users,setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [partners, setEditPartner] = useState<Partner[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [viewPartner, setViewPartner] = useState<Partner | null>(null)


  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Partner deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/partner'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (department: Partner) => {
    setEditingPartner(department)
    setIsModalOpen(true)
  }

  const handleView = (department: Partner) => {
    setViewPartner(department)
    setIsModalOpen(true)
  }

  const fetchEmployeeUsers = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await axiosInstance.get('/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.status !== 200) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.data
      console.log(data)

      const mappedRoles = data.msg.map((user: any) => ({
        id: user.id,
        tenant_id: user.tenantId,
        firstname:user.firstname,
        name: user.name,
        phone:user.phone,
        email: user.email,
        created_at: user.createdAt,
      }));
      setUser(mappedRoles);
    } catch (error) {
      console.error('Error fetching users:', error)
    }
   }

  useEffect(()=>{
    fetchEmployeeUsers()
  },[])

  const handleDelete = (partner: Partner) => {
    deleteMutation.mutate(`/partner/${partner?._id}`)
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Partners" 
       action={({
        label:"Add Partner",
        onClick: () => setIsModalOpen(true),
       })}
      />

     <DataTable
      columns={columns}
      url="/partner/"
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
      />
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false) 
          setEditingPartner(null)
          setViewPartner(null)
        }}
        title={
          viewPartner
            ? 'View Partner' // 👈 Set title for view mode
            : editingPartner
            ? 'Edit Partner'
            : 'Add Partner'
        }
      >

      <PartnerForm
        // partner={{editingPartner,viewPartner}}
        partner={editingPartner}
        viewPartner = {viewPartner}
        users={users}
        setIsModalOpen={setIsModalOpen}
      />
      </Modal>

    </div>
  )
}

