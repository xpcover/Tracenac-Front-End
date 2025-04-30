import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ForexRateForm from './ForexRateForm'

interface ForexRate {
  rate_id: string
  tenant_id: string
  currency_code: string
  date: string
  exchange_rate: number
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<ForexRate>()

const columns = [
  columnHelper.accessor('currency_code', {
    header: 'Currency',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => format(new Date(info.getValue()), 'PP'),
  }),
  columnHelper.accessor('exchange_rate', {
    header: 'Exchange Rate',
    cell: (info) => (
      <span className="font-mono">
        {info.getValue().toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4,
        })}
      </span>
    ),
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

// Mock data
const mockRates: ForexRate[] = [
  {
    rate_id: '1',
    tenant_id: '1',
    currency_code: 'EUR',
    date: '2024-03-15',
    exchange_rate: 1.0865,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    rate_id: '2',
    tenant_id: '1',
    currency_code: 'GBP',
    date: '2024-03-15',
    exchange_rate: 1.2734,
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
]

export default function ForexRatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRate, setEditingRate] = useState<ForexRate | null>(null)

  const handleEdit = (rate: ForexRate) => {
    setEditingRate(rate)
    setIsModalOpen(true)
  }

  const handleDelete = (rate: ForexRate) => {
    // In a real app, this would make an API call
    console.log('Delete rate:', rate)
  }

  return (
    <div>
      <PageHeader
        title="Forex Rates"
        description="Manage currency exchange rates"
        action={{
          label: 'Add Rate',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockRates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRate(null)
        }}
        title={editingRate ? 'Edit Rate' : 'Add Rate'}
      >
        <ForexRateForm
          rate={editingRate}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingRate(null)
          }}
        />
      </Modal>
    </div>
  )
}