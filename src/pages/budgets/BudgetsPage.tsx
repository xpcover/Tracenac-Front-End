import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import BudgetForm from './BudgetForm'
import { Budget } from '@/lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'


const columnHelper = createColumnHelper<Budget>()

const columns = [
  columnHelper.accessor('assetId', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fiscal_year', {
    header: 'Fiscal Year',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('budget_amount', {
    header: 'Budget',
    cell: (info) => (
      <span className="font-mono">
        $ {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('actual_amount', {
    header: 'Actual',
    cell: (info) => (
      <span className="font-mono">
        $ {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('variance', {
    header: 'Variance',
    cell: (info) => {
      const varianceStr = info.getValue(); // this is string like "2000" or "-2000"
      const variance = Number(varianceStr); // convert temporarily just for color

      return (
        <span
          className={`font-mono ${
            variance < 0
              ? 'text-red-600'
              : variance > 0
              ? 'text-green-600'
              : 'text-gray-600'
          }`}
        >
          $ {varianceStr}
        </span>
      )
    },
  }),
  columnHelper.accessor('createdBy', {
    header: 'Created By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
];


// Mock data
export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [viewBudget, setViewBudget] = useState<Budget | null>(null)

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Budget deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/department/budget'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setIsModalOpen(true)
  }

  const handleDelete = (budget: Budget) => {
    deleteMutation.mutate(`/department/budget/${budget?._id}`)
  }

  const handleView = (budget:Budget) =>{
    setViewBudget(budget)
    setIsModalOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Budgets"
        description="Manage asset budgets and track variances"
        action={{
          label: 'Add Budget',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url="/department/budget"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBudget(null)
          setViewBudget(null)
        }}
        title={
          viewBudget
            ? 'View Budget' // 👈 Set title for view mode
            : editingBudget
            ? 'Edit Budget'
            : 'Add Budget'
        }
      >
        <BudgetForm
          budget={editingBudget}
          viewBudget = {viewBudget}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </div>
  )
}