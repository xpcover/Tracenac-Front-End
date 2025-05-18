import Button from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { DataTable } from '@/components/ui/Table'
import { createColumnHelper } from '@tanstack/react-table'
import ShortURLNavigation from '../ShortURLNavigation'
import { Calculator, QrCode } from 'lucide-react'

function PreConfiguredLevel() {

const columnHelper = createColumnHelper<T>()

const columns = [
  columnHelper.accessor('levels', {
    header: 'Levels',
    cell: (info) => (
      <span className="truncate max-w-xs block">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('businessUnit', {
    header: 'Packing Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('location', {
    header: 'Packing Code',
    cell: (info) => <p>
      {info.getValue()}
    </p>
  }),
  columnHelper.accessor('s', {
    header: 'QTY of Pack Required',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('businessUnit', {
    header: 'Action',
    cell: (info) => <Button variant='ghost'>
      <QrCode /> Download
    </Button>,
  }),
]

  return (
    <div className='space-y-6'>
      <PageHeader
        title="Pack Chain"
        description="Create a Mapping of Boxes for tracking"
      />
      <ShortURLNavigation />
      <div className='flex gap-2'>
        <Calculator className='text-blue-600'/>
        <div className='h-fit'>
          <h3 className='text-lg font-medium leading-none text-nowrap'>Pack Chain Calculator</h3>
          <p className='text-xs text-slate-500 mt-1'>Calculate the total quantity required for different levels of packs</p>
        </div>
      </div>
      <DataTable
              columns={columns}

              // url="/shortcode/url-shortner"
            />
      
    </div>
  )
}

export default PreConfiguredLevel
