import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'

const ASSET_TYPES = ['Owned', 'Leased', 'WIP']
const DEPRECIATION_METHODS = ['SLM', 'WDV']
const ASSET_STATUSES = ['Active', 'Sold', 'Discarded', 'Relocated']

type AssetFormData = {
  clientId: string
  assetId: number
  assetName: string
  assetCode: string
  assetType: string
  categoryId: string
  departmentId: string
  locationId: string
  costCentreId: string
  purchaseDate: string
  latitude: number
  longitude: number
  purchaseCost: number
  depreciationMethod: string
  depreciationRate: number
  usefulLife: number
  salvageValue: number
  currentValue: number
  marketValuation: number
  status: string
  warrantyEndDate: string
  insuranceEndDate: string
  amcEndDate: string
  leaseEndDate: string
  shiftUsageDetails: string
  barcodeLink: string
  impairmentValue: number
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: asset || {},
  })

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const [categoriesRes, departmentsRes, locationsRes, costCentresRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/departments'),
          axios.get('/api/locations'),
          axios.get('/api/cost-centres'),
        ])
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : [])
        setDepartments(Array.isArray(departmentsRes.data) ? departmentsRes.data : [])
        setLocations(Array.isArray(locationsRes.data) ? locationsRes.data : [])
        setCostCentres(Array.isArray(costCentresRes.data) ? costCentresRes.data : [])
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
        setCategories([])
        setDepartments([])
        setLocations([])
        setCostCentres([])
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
            <Input type="number" {...register('assetId', { required: true })} className="mt-1" />
            {errors.assetId && <p className="mt-1 text-sm text-red-600">Asset ID is required</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <Input {...register('assetName', { required: true })} className="mt-1" />
            {errors.assetName && <p className="mt-1 text-sm text-red-600">Asset Name is required</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Code</label>
            <Input {...register('assetCode')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select {...register('assetType')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
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
            <select {...register('categoryId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Category</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select {...register('departmentId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Department</option>
              {departments.map((department: any) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select {...register('locationId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Location</option>
              {locations.map((location: any) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Centre</label>
            <select {...register('costCentreId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Cost Centre</option>
              {costCentres.map((costCentre: any) => (
                <option key={costCentre.id} value={costCentre.id}>
                  {costCentre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Cost</label>
            <Input type="number" {...register('purchaseCost')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depreciation Method</label>
            <select {...register('depreciationMethod')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
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
            <Input type="number" {...register('usefulLife')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salvage Value</label>
            <Input type="number" {...register('salvageValue')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lease End Date</label>
            <Input type="date" {...register('leaseEndDate')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Market Valuation</label>
            <Input type="number" {...register('marketValuation')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Insurance End Date</label>
            <Input type="date" {...register('insuranceEndDate')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">AMC End Date</label>
            <Input type="date" {...register('amcEndDate')} className="mt-1" />
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
            <label className="block text-sm font-medium text-gray-700">Warranty End Date</label>
            <Input type="date" {...register('warrantyEndDate')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <Input type="text" {...register('notes')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode Link</label>
            <Input type="text" {...register('barcodeLink')} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Asset</Button>
      </div>
    </form>
  )
}