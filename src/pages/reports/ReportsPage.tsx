import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ReportForm from './ReportForm'

interface Report {
  report_id: string
  tenant_id: string
  report_name: string
  report_type: 'asset' | 'depreciation' | 'maintenance' | 'usage'
  parameters: string
  created_by: string
  approved_by: string | null
  created_at: string
  updated_at: string
}

const columnHelper = createColumnHelper<Report>()

const columns = [
  columnHelper.accessor('report_name', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('report_type', {
    header: 'Type',
    cell: (info) => (
      <span className="capitalize">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('created_by', {
    header: 'Created By',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('approved_by', {
    header: 'Approved By',
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('created_at', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

// Mock data
const mockReports: Report[] = [
  {
    report_id: '1',
    tenant_id: '1',
    report_name: 'Monthly Asset Summary',
    report_type: 'asset',
    parameters: '{"month": "2024-03"}',
    created_by: 'USER001',
    approved_by: 'USER002',
    created_at: '2024-03-15T10:00:00Z',
    updated_at: '2024-03-15T10:00:00Z',
  },
  {
    report_id: '2',
    tenant_id: '1',
    report_name: 'Q1 Depreciation Report',
    report_type: 'depreciation',
    parameters: '{"quarter": "2024-Q1"}',
    created_by: 'USER001',
    approved_by: null,
    created_at: '2024-03-14T15:30:00Z',
    updated_at: '2024-03-14T15:30:00Z',
  },
]

export default function ReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<Report | null>(null)

  const handleEdit = (report: Report) => {
    setEditingReport(report)
    setIsModalOpen(true)
  }

  const handleDelete = (report: Report) => {
    // In a real app, this would make an API call
    console.log('Delete report:', report)
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate and manage asset reports"
        action={{
          label: 'Generate Report',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockReports}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingReport(null)
        }}
        title={editingReport ? 'Edit Report' : 'Generate Report'}
      >
        <ReportForm
          report={editingReport}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingReport(null)
          }}
        />
      </Modal>
    </div>
  )
}