import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import BudgetForm from './BudgetForm'

interface Budget {
  budget_id: string
  tenant_id: string
  asset_id: string
  fiscal_year: string
  budget_amount: number
  actual_amount: number
  variance: number
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Budget>()

const columns = [
  columnHelper.accessor('asset_id', {
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
        ${' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('actual_amount', {
    header: 'Actual',
    cell: (info) => (
      <span className="font-mono">
        ${' '}
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }),
  columnHelper.accessor('variance', {
    header: 'Variance',
    cell: (info) => {
      const variance = info.getValue()
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
          ${' '}
          {variance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            signDisplay: 'always',
          })}
        </span>
      )
    },
  }),
  columnHelper.accessor('created_by', {
    header: 'Created By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockBudgets: Budget[] = [
  {
    budget_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    fiscal_year: '2024',
    budget_amount: 3000,
    actual_amount: 2800,
    variance: 200,
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
  {
    budget_id: '2',
    tenant_id: '1',
    asset_id: 'SRV001',
    fiscal_year: '2024',
    budget_amount: 5000,
    actual_amount: 5500,
    variance: -500,
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-01T11:00:00Z',
    updated_at: '2024-01-01T11:00:00Z',
  },
]

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setIsModalOpen(true)
  }

  const handleDelete = (budget: Budget) => {
    // In a real app, this would make an API call
    console.log('Delete budget:', budget)
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
        data={mockBudgets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBudget(null)
        }}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          budget={editingBudget}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingBudget(null)
          }}
        />
      </Modal>
    </div>
  )
}