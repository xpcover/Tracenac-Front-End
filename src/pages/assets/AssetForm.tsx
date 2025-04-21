import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'

const ASSET_TYPES = ['Owned', 'Leased', 'WIP']
const DEPRECIATION_METHODS = ['SLM', 'WDV']
const ASSET_STATUSES = ['Active', 'Sold', 'Discarded', 'Relocated']

type AssetFormData = {
  asset_id?: number
  asset_code: string
  asset_name: string
  asset_type: string
  category_id: string
  block_id: string
  department_id: string
  location_id: string
  cost_centre_id: string
  purchase_date: string
  purchase_cost: number
  purchase_currency: string
  exchange_rate: number
  current_value: number
  depreciation_method: string
  depreciation_rate: number
  useful_life: number
  salvage_value: number
  lease_end_date: string | null
  warranty_end_date: string
  insurance_end_date: string
  amc_end_date: string
  market_valuation: number
  status: string
  barcode: string
  impairment_value: number
  notes: string
}

interface AssetFormProps {
  asset?: Partial<AssetFormData>
  onSubmit: (data: AssetFormData) => void
}

export default function AssetForm({ asset, onSubmit }: AssetFormProps) {
  const [categories, setCategories] = useState([])
  const [departments, setDepartments] = useState([])
  const [locations, setLocations] = useState([])
  const [costCentres, setCostCentres] = useState([])
  const [blocks, setBlocks] = useState([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: asset || {
      purchase_currency: 'INR',
      exchange_rate: 1.0,
      lease_end_date: null
    },
  })

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [
          categoriesRes, 
          departmentsRes, 
          locationsRes, 
          costCentresRes,
          blocksRes
        ] = await Promise.all([
          axios.get('/categories'),
          axios.get('/departments'),
          axios.get('/locations'),
          axios.get('/cost-centres'),
          axios.get('/blocks')
        ])

        console.log("===>form",categoriesRes,departmentsRes,locationsRes,costCentresRes,blocksRes);
        
        // setCategories(categoriesRes?.data || [])
        // setDepartments(departmentsRes?.data || [])
        // setLocations(locationsRes?.data || [])
        // setCostCentres(costCentresRes?.data || [])
        // setBlocks(blocksRes?.data || [])
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    }
    fetchDropdownData()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset ID</label>
            <Input type="number" {...register('asset_id')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <Input {...register('asset_name', { required: true })} className="mt-1" />
            {errors.asset_name && <p className="mt-1 text-sm text-red-600">Asset Name is required</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Code</label>
            <Input {...register('asset_code')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select {...register('asset_type')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Asset Type</option>
              {ASSET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Location Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select {...register('category_id')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Block</label>
            <select {...register('block_id')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Block</option>
              {blocks.map((block: any) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select {...register('department_id')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Department</option>
              {departments.map((department: any) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select {...register('location_id')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Location</option>
              {locations.map((location: any) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Centre</label>
            <select {...register('cost_centre_id')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Cost Centre</option>
              {costCentres.map((costCentre: any) => (
                <option key={costCentre.id} value={costCentre.id}>
                  {costCentre.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Currency</label>
            <Input {...register('purchase_currency')} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <Input type="date" {...register('purchase_date')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Cost</label>
            <Input type="number" step="0.01" {...register('purchase_cost')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <Input type="number" step="0.0001" {...register('exchange_rate')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Method</label>
            <select {...register('depreciation_method')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Method</option>
              {DEPRECIATION_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Useful Life (years)</label>
            <Input type="number" {...register('useful_life')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Rate</label>
            <Input type="number" step="0.01" {...register('depreciation_rate')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Salvage Value</label>
            <Input type="number" step="0.01" {...register('salvage_value')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Value</label>
            <Input type="number" step="0.01" {...register('current_value')} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Dates Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dates Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lease End Date</label>
            <Input type="date" {...register('lease_end_date')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warranty End Date</label>
            <Input type="date" {...register('warranty_end_date')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance End Date</label>
            <Input type="date" {...register('insurance_end_date')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">AMC End Date</label>
            <Input type="date" {...register('amc_end_date')} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select {...register('status')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Status</option>
              {ASSET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Market Valuation</label>
            <Input type="number" step="0.01" {...register('market_valuation')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode</label>
            <Input {...register('barcode')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Impairment Value</label>
            <Input type="number" step="0.01" {...register('impairment_value')} className="mt-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <Input {...register('notes')} className="mt-1" />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Asset</Button>
      </div>
    </form>
  )
}