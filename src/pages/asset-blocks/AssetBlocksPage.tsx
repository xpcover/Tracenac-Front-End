import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { AssetBlock } from '@/lib/types'
import AssetBlockForm from './AssetBlockForm'

const columnHelper = createColumnHelper<AssetBlock>()

const columns = [
  columnHelper.accessor('block_id', {
    header: 'Block ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('block_name', {
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
const mockBlocks: AssetBlock[] = [
  {
    block_id: '1',
    tenant_id: '1',
    block_name: 'Block A',
    description: 'Main office building block',
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-03-10T10:00:00Z',
  },
  {
    block_id: '2',
    tenant_id: '1',
    block_name: 'Block B',
    description: 'Manufacturing facility block',
    created_at: '2024-03-09T15:30:00Z',
    updated_at: '2024-03-10T09:15:00Z',
  },
]

export default function AssetBlocksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<AssetBlock | null>(null)

  const handleEdit = (block: AssetBlock) => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }

  const handleDelete = (block: AssetBlock) => {
    // In a real app, this would make an API call
    console.log('Delete block:', block)
  }

  return (
    <div>
      <PageHeader
        title="Asset Blocks"
        description="Manage asset blocks and locations"
        action={{
          label: 'Add Block',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        data={mockBlocks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBlock(null)
        }}
        title={editingBlock ? 'Edit Block' : 'Add Block'}
      >
        <AssetBlockForm
          block={editingBlock}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingBlock(null)
          }}
        />
      </Modal>
    </div>
  )
}