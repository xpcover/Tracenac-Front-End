import { useState } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import ReportTemplateForm from './ReportTemplateForm'

interface ReportTemplate {
  id: string
  name: string
  category: string
  type: 'asset' | 'maintenance' | 'financial' | 'compliance'
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  lastUsed: string | null
  createdAt: string
}

const columnHelper = createColumnHelper<ReportTemplate>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Template Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <span className={`px-2 py-1 text-xs rounded-full ${
        {
          asset: 'bg-blue-100 text-blue-800',
          maintenance: 'bg-green-100 text-green-800',
          financial: 'bg-purple-100 text-purple-800',
          compliance: 'bg-orange-100 text-orange-800',
        }[info.getValue()]
      }`}>
        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
      </span>
    ),
  }),
  columnHelper.accessor('frequency', {
    header: 'Frequency',
    cell: (info) => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1),
  }),
  columnHelper.accessor('lastUsed', {
    header: 'Last Used',
    cell: (info) => info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : 'Never',
  }),
]

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Asset Condition Report',
    category: 'Assets',
    type: 'asset',
    frequency: 'monthly',
    lastUsed: '2024-03-01',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maintenance Schedule',
    category: 'Maintenance',
    type: 'maintenance',
    frequency: 'weekly',
    lastUsed: '2024-03-10',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Depreciation Summary',
    category: 'Finance',
    type: 'financial',
    frequency: 'quarterly',
    lastUsed: null,
    createdAt: '2024-02-01',
  },
]

export default function ReportTemplateList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplate | null>(null)

  const handleEdit = (template: ReportTemplate) => {
    setEditingTemplate(template)
    setIsModalOpen(true)
  }

  const handleDelete = (template: ReportTemplate) => {
    // In a real app, this would make an API call
    console.log('Delete template:', template)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Templates"
        description="Manage and create report templates"
        action={{
          label: 'Create Template',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockTemplates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTemplate(null)
        }}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
      >
        <ReportTemplateForm
          template={editingTemplate}
          onSubmit={(data) => {
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingTemplate(null)
          }}
        />
      </Modal>
    </div>
  )
}