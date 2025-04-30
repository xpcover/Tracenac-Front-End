import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ContractForm from './ContractForm'

interface Contract {
  contract_id: string
  tenant_id: string
  asset_id: string
  contract_type: 'amc' | 'insurance' | 'warranty'
  provider_name: string
  start_date: string
  end_date: string
  cost: number
  terms: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Contract>()

const columns = [
  columnHelper.accessor('asset_id', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('contract_type', {
    header: 'Type',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          {
            amc: 'bg-purple-100 text-purple-800',
            insurance: 'bg-blue-100 text-blue-800',
            warranty: 'bg-green-100 text-green-800',
          }[info.getValue()]
        }`}
      >
        {info.getValue().toUpperCase()}
      </span>
    ),
  }),
  columnHelper.accessor('provider_name', {
    header: 'Provider',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('start_date', {
    header: 'Start Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('end_date', {
    header: 'End Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('cost', {
    header: 'Cost',
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
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockContracts: Contract[] = [
  {
    contract_id: '1',
    tenant_id: '1',
    asset_id: 'LAP001',
    contract_type: 'warranty',
    provider_name: 'Apple Inc.',
    start_date: '2024-01-15',
    end_date: '2025-01-15',
    cost: 299.99,
    terms: 'Standard warranty terms',
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    contract_id: '2',
    tenant_id: '1',
    asset_id: 'LAP001',
    contract_type: 'insurance',
    provider_name: 'TechInsure',
    start_date: '2024-01-15',
    end_date: '2025-01-15',
    cost: 199.99,
    terms: 'Comprehensive coverage',
    created_by: 'USER001',
    updated_by: 'USER001',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T11:00:00Z',
  },
]

export default function ContractsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  const handleDelete = (contract: Contract) => {
    // In a real app, this would make an API call
    console.log('Delete contract:', contract)
  }

  return (
    <div>
      <PageHeader
        title="Contracts"
        description="Manage AMC, insurance, and warranty contracts"
        action={{
          label: 'Add Contract',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockContracts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingContract(null)
        }}
        title={editingContract ? 'Edit Contract' : 'Add Contract'}
      >
        <ContractForm
          contract={editingContract}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingContract(null)
          }}
        />
      </Modal>
    </div>
  )
}