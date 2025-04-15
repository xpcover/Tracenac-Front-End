import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { User } from '@/lib/types'
import UserForm from './UserForm'
import axios from 'axios'

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('tenant_id', {
    header: 'User ID',
    cell: (info) => info.getValue() || 'N/A',
  }),
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

  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  console.log("Editing",editingUser)

  const fetchEmployeeUsers = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      try {
        const response = await axios.get('http://localhost:4000/api/user/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.status !== 200) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.data
        console.log(data)
        // export interface User {
        //   id: string
        //   tenant_id: string
        //   name: string
        //   phone: string
        
        //   username: string
        //   password: string
        //   first_name: string
        //   last_name: string
        //   email: string
        //   is_active: boolean
        //   created_at: string
        //   updated_at: string
        // }
        const mappedRoles = data.msg.map((user: any) => ({
          id: user.id,
          tenant_id: user.tenantId,
          firstname:user.firstname,
          name: user.name,
          phone:user.phone,
          email: user.email,
          created_at: user.createdAt,
        }));
        setUsers(mappedRoles);
      } catch (error) {
        console.error('Error fetching users:', error)
      }
  }

  useEffect(()=>{
    fetchEmployeeUsers()
  },[])

  // const { username, password, first_name, last_name, email, is_active, userRole } = data

  const handleAddUser = async (data:any) => {
    const { username, password, first_name, last_name, email, userRole } = data;
    const userData = {
      name: `${first_name} ${last_name}`,
      username,
      email,
      phone: '1234567890', // Replace with actual phone field if available
      password,
      userRole,
    };
  
    try {
      const response = await axios.post(
        'http://localhost:4000/api/user/add',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );      
  
      if (response.data.status === true) {
        fetchEmployeeUsers()
      }
      
    } catch (error) {
      console.error('Error adding user:', error);
      // Handle error, e.g., show an error message to the user
    }
  };


  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const token = localStorage.getItem('token')
  //     if (!token) {
  //       console.error('No token found')
  //       return
  //     }

  //     try {
  //       const response = await axios.get('https://api.tracenac.com/api/user/', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       })

  //       if (response.status !== 200) {
  //         throw new Error('Failed to fetch users')
  //       }

  //       const data = await response.data
  //       setUsers(data.msg) // Assuming the API response is an array of users
  //     } catch (error) {
  //       console.error('Error fetching users:', error)
  //     }
  //   }

  //   fetchUsers()
  // }, [])


  // Actions
  const handleEditUser = (user: User) => {
    console.log('Edit user:', user)
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete =async(user: User) => {
    console.log('Delete user:', user)
    try{
      await axios.delete(
        `http://localhost:4000/api/user/delete-user/${user.id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setUsers((prevRoles)=>prevRoles.filter((r)=>r.id !== user.id))
    }catch(error){
      console.error('Error deleting role:', error)
    }
  }


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

      {/* Data Listing */}
      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEditUser}
        onDelete={handleDelete}
      />

      {/* Handling Toggle */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        title={editingUser ? 'Edit User' : 'Add Employee'}
      >

        {/* Handling User Submission */}
        <UserForm
          user={editingUser}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            if(editingUser){
              handleEditUser({ ...editingUser, ...data })
            }else{
              handleAddUser(data)
            }
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingUser(null)
          }}
        />
      </Modal>
    </div>
  )
}