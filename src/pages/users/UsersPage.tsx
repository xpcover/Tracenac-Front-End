import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { User } from '@/lib/types'
import UserForm from './UserForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'
import { axiosInstance } from '@/config/axiosInstance'

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Username',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: (info) => info.getValue() || 'N/A',
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue() || 'N/A',
  }),

  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function UsersPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)
  
  // const [users, setUsers] = useState<User[]>([])
  // console.log("Editing",editingUser)

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/user'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = (user: User) => {
    deleteMutation.mutate(`/user${user?._id}`)
  }

  const handleView = (user: User) => {
    setViewUser(user)
    setIsModalOpen(true)
  }

  const fetchRole = async () => {
    try {
      const response = await axiosInstance.get("/tenant/roles/");
      setRoles(response.data.msg);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchRole()
  },[])


  return (
    <div>
      <PageHeader
        title="Employee"
        description="Manage system employee and their access"
        action={{
          label: 'Add Employee',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url="/user"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView = {handleView}
       />

      {/* Handling Toggle */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
          setViewUser(null)
        }}
        title={
          viewUser
            ? 'View User' // 👈 Set title for view mode
            : editingUser
            ? 'Edit User'
            : 'Add  User'
        }
      >

        {/* Handling User Submission */}
        <UserForm
          roles={roles}
          user={editingUser}
          setIsModalOpen={setIsModalOpen}
          viewUser={viewUser}
        />
      </Modal>
    </div>
  )
}