import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { Tenant } from '@/lib/types'
import TenantForm from './TenantForm'

const columnHelper = createColumnHelper<Tenant>()

const columns = [
  columnHelper.accessor('tenant_id', {
    header: 'Tenant ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('tenant_name', {
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
const mockTenants: Tenant[] = [
  {
    tenant_id: '1',
    tenant_name: 'Acme Corp',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    tenant_id: '2',
    tenant_name: 'TechCo',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function TenantsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant)
    setIsModalOpen(true)
  }

  const handleDelete = (tenant: Tenant) => {
    // In a real app, this would make an API call
    console.log('Delete tenant:', tenant)
  }

  return (
    <div>
      <PageHeader
        title="Tenants"
        description="Manage your organization's tenants"
        action={{
          label: 'Add Tenant',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockTenants}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTenant(null)
        }}
        title={editingTenant ? 'Edit Tenant' : 'Add Tenant'}
      >
        <TenantForm
          tenant={editingTenant}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingTenant(null)
          }}
        />
      </Modal>
    </div>
  )
}