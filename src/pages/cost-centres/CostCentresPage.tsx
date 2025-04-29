import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { CostCentre } from '@/lib/types'
import CostCentreForm from './CostCentreForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const columnHelper = createColumnHelper<CostCentre>()

const columns = [
  columnHelper.accessor('costCentreName', {
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



export default function CostCentresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCostCentre, setEditingCostCentre] = useState<CostCentre | null>(null)

  const queryClient = useQueryClient();

  const handleEdit = (costCentre: CostCentre) => {
    setEditingCostCentre(costCentre)
    setIsModalOpen(true)
  }

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Cost Center deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/cost-center'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleDelete = (costCenter: CostCentre) => {
    deleteMutation.mutate(`/department/cost-center/${costCenter?._id}`)
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
        url="/department/cost-center"
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
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  )
}