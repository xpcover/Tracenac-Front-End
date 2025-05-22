import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Role } from '@/lib/types'
import RoleForm from './RoleForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const columnHelper = createColumnHelper<Role>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]


export default function RolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [viewRole, setViewRole] = useState<Role | null>(null)
  const queryClient = useQueryClient();


  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/tenant/role-delete'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (role: Role ) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  const handleView =(role:Role) =>{
    setViewRole(role)
    setIsModalOpen(true)
  }

  const handleDelete = (role: Role) => {
    deleteMutation.mutate(`/tenant/role-delete/${role?._id}`)
  }

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

      <DataTable
        columns={columns}
        url="/tenant/roles"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRole(null)
          setViewRole(null)
        }}
        title={
          viewRole
            ? 'View Role' // 👈 Set title for view mode
            : editingRole
            ? 'Edit Role'
            : 'Add  Role'
        }
      >
        <RoleForm
          role={editingRole}
          setIsModalOpen={setIsModalOpen}
          viewRole={viewRole}
        />
      </Modal>
    </div>
  )
}