import { useState } from 'react'
import { format } from 'date-fns'
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/Table'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'
import DepreciationRecordForm from './DepreciationRecordForm'
import { axiosInstance } from '@/config/axiosInstance'

interface DepreciationRecord {
  assetId: string
  fiscal_year: string
  period_start_date: string
  period_end_date: string
  depreciationAmount: number
  depreciationMethod: string
  comparativeAmount: number
  rate: number
  method_changed: boolean
  changed_by: string | null
  notes: string
  createdAt: string
  updatedAt: string
}


const columnHelper = createColumnHelper<DepreciationRecord>()

const columns = [
  columnHelper.accessor('assetId', {
    header: 'Asset ID',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('depreciationAmount', {
    header: 'Amount',
    cell: (info) => (
      <span className="font-mono">
        ${" "}
        {info.getValue()["$numberDecimal"]}
      </span>
    ),
  }),
  columnHelper.accessor('depreciationMethod', {
    header: 'Depreciation Method',
    cell: (info) => info.getValue().toUpperCase(),
  }),
  columnHelper.accessor('comparativeAmount', {
    header: 'Method Changed',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          info.getValue()
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {info.getValue() ? 'Yes' : 'No'}
      </span>
    ),
  }),
]


export default function DepreciationRecordsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DepreciationRecord | null>(null)

  // const handleEdit = (record: DepreciationRecord) => {
  //   setEditingRecord(record)
  //   setIsModalOpen(true)
  // }

  // const handleDelete = (record: DepreciationRecord) => {
  //   // In a real app, this would make an API call
  //   console.log('Delete record:', record)
  // }

  // const fetchAllDepreciation=()=>{
  //   try{
  //     const response =  axiosInstance.get("/department/depreciation")
      
  //   }
  // }

  return (
    <div>
      <PageHeader
        title="Depreciation Records"
        description="Track and manage asset depreciation records"
        action={{
          label: 'Add Record',
          onClick: () => setIsModalOpen(true),
        }}
      />

      <DataTable
        columns={columns}
        url="/department/depreciation"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingRecord(null)
        }}
        title={editingRecord ? 'Edit Record' : 'Add Record'}
      >
        {/* <DepreciationRecordForm
          record={editingRecord}
          onSubmit={(data) => {
            // In a real app, this would make an API call
            console.log('Form submitted:', data)
            setIsModalOpen(false)
            setEditingRecord(null)
          }}
        /> */}
      </Modal>
    </div>
  )
}
