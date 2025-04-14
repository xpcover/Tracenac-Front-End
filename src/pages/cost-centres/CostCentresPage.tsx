import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { CostCentre } from '@/lib/types'
import CostCentreForm from './CostCentreForm'

const columnHelper = createColumnHelper<CostCentre>()

const columns = [
  columnHelper.accessor('cost_centre_id', {
    header: 'Cost Centre ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('cost_centre_name', {
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
const mockCostCentres: CostCentre[] = [
  {
    cost_centre_id: '1',
    tenant_id: '1',
    cost_centre_name: 'IT Operations',
    description: 'Information Technology operational expenses',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    cost_centre_id: '2',
    tenant_id: '1',
    cost_centre_name: 'Manufacturing',
    description: 'Manufacturing and production costs',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function CostCentresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCostCentre, setEditingCostCentre] = useState<CostCentre | null>(null)

  const handleEdit = (costCentre: CostCentre) => {
    setEditingCostCentre(costCentre)
    setIsModalOpen(true)
  }

  const handleDelete = (costCentre: CostCentre) => {
    // In a real app, this would make an API call
    console.log('Delete cost centre:', costCentre)
  }

  return (
    <div>
      <PageHeader
        title="Cost Centres"
        description="Manage cost centres for financial tracking"
        action={{
          label: 'Add Cost Centre',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockCostCentres}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCostCentre(null)
        }}
        title={editingCostCentre ? 'Edit Cost Centre' : 'Add Cost Centre'}
      >
        <CostCentreForm
          costCentre={editingCostCentre}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingCostCentre(null)
          }}
        />
      </Modal>
    </div>
  )
}