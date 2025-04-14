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
  columnHelper.accessor('id', {
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

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = (user: User) => {
    // In a real app, this would make an API call
    console.log('Delete user:', user)
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

      <DataTable
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        title={editingUser ? 'Edit User' : 'Add Employee'}
      >
        <UserForm
          user={editingUser}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingUser(null)
          }}
        />
      </Modal>
    </div>
  )
}