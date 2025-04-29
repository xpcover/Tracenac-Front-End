import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { dataTableService } from '@/services/dataTable.service'
import toast from 'react-hot-toast'
import ApiService from '@/services/api.service'

const ASSET_TYPES = ['Owned', 'Leased', 'WIP']
const DEPRECIATION_METHODS = ['SLM', 'WDV']
const ASSET_STATUSES = ['Active', 'Sold', 'Discarded', 'Relocated']

type AssetFormData = {
  assetId?: number
  assetCode: string
  assetName: string
  assetType: string
  categoryId: string
  block_id: string
  departmentId: string
  locationId: string
  costCentreId: string
  purchaseDate: string
  purchaseCost: number
  purchase_currency: string
  exchange_rate: number
  current_value: number
  depreciationMethod: string
  depreciationRate: number
  usefulLife: number
  salvageValue: number
  lease_end_date: string | null
  warrantyEndDate: string
  insuranceEndDate: string
  amcEndDate: string
  marketValuation: number
  status: string
  barcodeLink: string
  shiftUsageDetails: object,
  impairmentValue: number
  notes: string
}


export default function AddEditAssetPage() {

  const { id } = useParams()

  const { data: asset, isLoading } = useQuery({
    queryKey: ['asset', id],
    queryFn: () => dataTableService.fetchSingleData(`/assets/${id}`),
    enabled: !!id
  })

  const [categories, departments, locations, costCentres, blocks] = useQueries({
      queries: [
        { queryKey: ['catogories'], queryFn: () => ApiService.get('/category') },
        { queryKey: ['departments'], queryFn: () => ApiService.get('/department/departments') },
        { queryKey: ['locations'], queryFn: () => ApiService.get('/department/location') },
        { queryKey: ['costCentres'], queryFn: () => ApiService.get('department/cost-center') },
        { queryKey: ['/assets/block'], queryFn: () => ApiService.get('/assets/block') },
      ]
    });


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: {
      purchase_currency: 'INR',
      exchange_rate: 1.0,
      lease_end_date: null
    },
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (asset) {
        reset(asset)
      }
  },[asset])

  const createData = useMutation({
    mutationFn: data => dataTableService.createData('/assets', data),
    onSuccess: () => {
      toast.success("Asset added successfully");
      navigate('/assets')
    },
    onError: () => {
      toast.error("Failed to add asset");
    }
  })

  const updateData = useMutation({
    mutationFn: (data) => dataTableService.updateData(`/assets/${id}`, data),
    onSuccess: () => {
      navigate('/assets')
      toast.success("Asset updated successfully");
    },
    onError: () => {
      toast.error("Failed to update asset");
    }
  })

  const onSubmit = (data: any) =>{
    console.log("===>2",data)
      if(id){
        updateData.mutate(data);
      }else{
        createData.mutate(data);
      }
  }

  if(isLoading || [categories, departments, locations, costCentres, blocks].some(query => query.isLoading)){
    return <div>Loading...</div>
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <h1 className='text-2xl font-bold'>{id ? 'Edit Asset' : 'Add Asset'}</h1>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset ID</label>
            <Input type="number" {...register('assetId')} className="mt-1" />
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
              {categories?.data?.length > 0 && categories?.data.map((category: any) => (
                <option key={category?._id} value={category?._id}>
                  {category?.category_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Block</label>
            <select {...register('blockId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Block</option>
              {blocks?.data?.length > 0 && blocks?.data.map((block: any) => (
                <option key={block?._id} value={block?._id}>
                  {block?.blockName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select {...register('departmentId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Department</option>
              {departments?.data?.length > 0 && departments?.data.map((department: any) => (
                <option key={department?._id} value={department?._id}>
                  {department?.departmentName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select {...register('locationId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Location</option>
              {locations?.data?.length > 0 && locations?.data.map((location: any) => (
                <option key={location?._id} value={location?._id}>
                  {location?.location_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost Centre</label>
            <select {...register('costCentreId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select Cost Centre</option>
              {costCentres?.data?.length > 0 && costCentres?.data.map((costCentre: any) => (
                <option key={costCentre?.id} value={costCentre?._id}>
                  {costCentre?.costCentreName}
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
            <Input type="date" {...register('purchaseDate')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Cost</label>
            <Input type="number" step="0.01" {...register('purchaseCost')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exchange Rate</label>
            <Input type="number" step="0.0001" {...register('exchange_rate')} className="mt-1" />
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
            <label className="block text-sm font-medium text-gray-700">Depreciation Rate</label>
            <Input type="number" step="0.01" {...register('depreciationRate')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Salvage Value</label>
            <Input type="number" step="0.01" {...register('salvageValue')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Value</label>
            <Input type="number" step="0.01" {...register('marketValuation')} className="mt-1" />
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
            <Input type="date" {...register('warrantyEndDate')} className="mt-1" />
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
            <label className="block text-sm font-medium text-gray-700">Market Valuation</label>
            <Input type="number" step="0.01" {...register('market_valuation')} className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Barcode</label>
            <Input {...register('barcodeLink')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Impairment Value</label>
            <Input type="number" step="0.01" {...register('impairmentValue')} className="mt-1" />
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