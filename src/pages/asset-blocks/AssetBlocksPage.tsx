import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import { AssetBlock } from '@/lib/types'
import AssetBlockForm from './AssetBlockForm'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'

const columnHelper = createColumnHelper<AssetBlock>()

const columns = [
  columnHelper.accessor('tenantId', {
    header: 'Tenant ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('blockName', {
    header: 'Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Updated At',
    cell: (info) => format(new Date(info.getValue()), 'PPp'),
  }),
]

export default function AssetBlocksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<AssetBlock | null>(null)
  const [viewBlock,setViewBlock] = useState<AssetBlock | null>(null)

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: dataTableService.deleteData,
    onSuccess: () => {
      toast.success('Asset Block deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['/assets/block'] });
    },
    onError: (error) => {
      console.error('Error deleting todo:', error);
    }
  });

  const handleEdit = (block: AssetBlock) => {
    setEditingBlock(block)
    setIsModalOpen(true)
  }
  
  const handleView = (block:AssetBlock)=>{
    setViewBlock(block)
    setIsModalOpen(true)
  }

  const handleDelete = (block: AssetBlock) => {
    deleteMutation.mutate(`/assets/block/${block?._id}`)
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
        url="/assets/block"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView = {handleView}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBlock(null)
          setViewBlock(null)
        }}
        title={
          viewBlock
            ? 'View Block' // 👈 Set title for view mode
            : editingBlock
            ? 'Edit Block'
            : 'Add  Block'
        }
      >
        <AssetBlockForm
          block={editingBlock}
          setIsModalOpen={setIsModalOpen}
          viewBlock={viewBlock}
        />
      </Modal>
    </div>
  )
}