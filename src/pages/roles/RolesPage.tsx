import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Role } from '@/lib/types'
import RoleForm from './RoleForm'
import axios from 'axios'

const columnHelper = createColumnHelper<Role>()

const columns = [
  columnHelper.accessor('tenant_id', {
    header: 'Role ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('role_name', {
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

// Mock data - In a real app, this would come from an API
const mockRoles: Role[] = [
  {
    role_id: '1',
    tenant_id: '1',
    role_name: 'Admin',
    description: 'Full system access',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    role_id: '2',
    tenant_id: '1',
    role_name: 'User',
    description: 'Limited system access',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

console.log("roles",mockRoles)

export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roles, setRoles] = useState<Role[]>([]);


  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/tenant/get-roles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }

      const data = await response.json();
      console.log("Data",data)
      
      const mappedRoles = data.msg.map((role: any) => ({
        role_id: role._id,
        tenant_id: role.tenantId,
        role_name: role.name,
        description: role.description,
        created_at: role.createdAt,
        updated_at: role.updatedAt
      }));
      setRoles(mappedRoles);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(()=>{
    fetchRoles()
  },[])

  // Triggered when "Edit" is clicked
  const handleEdit = (role: Role) => {
    setEditingRole(role)        // Pre-fill modal fields
    setIsModalOpen(true)        // Open modal
  }


  const editRole = async (updatedRole: Role) => {
    const updatedData = {
      name: updatedRole.role_name,
      description: updatedRole.description,
    };
  
  
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/tenant/edit/${updatedRole.role_id}`,
        updatedData
      );
  
      console.log('Update success:', response.data);

      if(response.data.status === true){
        fetchRoles()
      }
  
      setIsModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Error updating role:', error);
      // Optional: Revert the optimistic update if something goes wrong
      // You can show an error message to the user
    }
  };

  const handleAddRole = async (data:any) => {
    try {
        // console.log('Adding role:', newRole);
        // const tenantId = await localStorage.getItem('tenantId'); 
        const newRole ={
            name: data.role_name,
            description:data.description,
            tenanatId : localStorage.getItem('tenantId')
        }
        const response = await axios.post('http://localhost:4000/api/tenant/roles', newRole);
        console.log('Added role:', response.data);
        if (response.data.status === true) {
            fetchRoles();
        }
    } catch (error) {
        console.error('Error adding role:', error);
    }
};
  
  

  const handleDelete = async(role: Role) => {
    // In a real app, this would make an API call
    console.log('Delete role:', role)
    try{
      await axios.delete(`http://localhost:4000/api/tenant/delete/${role.role_id}`)
      setRoles((prevRoles)=>prevRoles.filter((r)=>r.role_id !== role.role_id))
    }catch(error){
      console.error('Error deleting role:', error)
    }
  }

  console.log("Roles",roles)

  // if(roles.length === 0){
  //   return <p>Loading</p>
  // }

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Manage user roles and their permissions"
        action={{
          label: 'Add Role',
          onClick: () => setIsModalOpen(true),
        }}
      />
      {roles.length === 0?(
          <p className="text-center text-gray-500 mt-4">No Roles history available</p>
      ):(
              <DataTable
              columns={columns}
              data={roles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRole(null)
        }}
        title={editingRole ? 'Edit Role' : 'Add Role'}
      >
<RoleForm
  role={editingRole}
  onSubmit={(data) => {
    // handleAddRole(data);
    if (editingRole) {
      editRole({ ...editingRole, ...data });
    }
    else {
      console.log(data)
      handleAddRole(data);
    }
    console.log('Form submitted:', data);
    setIsModalOpen(false);
    setEditingRole(null);
  }}
/>

      </Modal>
    </div>
  )
}