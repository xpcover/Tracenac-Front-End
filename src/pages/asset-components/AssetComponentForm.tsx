import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { AssetComponent, assetComponentSchema } from '@/lib/types'

type ComponentFormData = z.infer<typeof assetComponentSchema>

interface AssetComponentFormProps {
  component?: AssetComponent | null
  onSubmit: (data: ComponentFormData) => void
}

const DEPRECIATION_METHODS = [
  'straight-line',
  'declining-balance',
  'sum-of-years',
  'units-of-production',
]

const COMPONENT_STATUSES = ['active', 'inactive', 'maintenance', 'disposed']

export default function AssetComponentForm({
  component,
  onSubmit,
}: AssetComponentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ComponentFormData>({
    resolver: zodResolver(assetComponentSchema),
    defaultValues: {
      asset_id: component?.asset_id || '',
      parent_component_id: component?.parent_component_id || null,
      component_name: component?.component_name || '',
      component_type: component?.component_type || '',
      purchase_cost: component?.purchase_cost || 0,
      purchase_date: component?.purchase_date || '',
      depreciation_method: component?.depreciation_method || 'straight-line',
      depreciation_rate: component?.depreciation_rate || 0,
      useful_life: component?.useful_life || 0,
      salvage_value: component?.salvage_value || 0,
      status: component?.status || 'active',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asset ID
            </label>
            <Input {...register('asset_id')} className="mt-1" />
            {errors.asset_id && (
              <p className="mt-1 text-sm text-red-600">{errors.asset_id.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parent Component ID
            </label>
            <Input {...register('parent_component_id')} className="mt-1" />
            {errors.parent_component_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.parent_component_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Component Name
            </label>
            <Input {...register('component_name')} className="mt-1" />
            {errors.component_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.component_name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Component Type
            </label>
            <Input {...register('component_type')} className="mt-1" />
            {errors.component_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.component_type.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {COMPONENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Financial Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Financial Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Cost
            </label>
            <Input
              type="number"
              step="0.01"
              {...register('purchase_cost', { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.purchase_cost && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purchase_cost.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <Input type="date" {...register('purchase_date')} className="mt-1" />
            {errors.purchase_date && (
              <p className="mt-1 text-sm text-red-600">
                {errors.purchase_date.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Depreciation Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Depreciation Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Depreciation Method
            </label>
            <select
              {...register('depreciation_method')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {DEPRECIATION_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
            {errors.depreciation_method && (
              <p className="mt-1 text-sm text-red-600">
                {errors.depreciation_method.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Depreciation Rate (%)
            </label>
            <Input
              type="number"
              step="0.01"
              {...register('depreciation_rate', { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.depreciation_rate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.depreciation_rate.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Useful Life (years)
            </label>
            <Input
              type="number"
              {...register('useful_life', { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.useful_life && (
              <p className="mt-1 text-sm text-red-600">
                {errors.useful_life.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Salvage Value
            </label>
            <Input
              type="number"
              step="0.01"
              {...register('salvage_value', { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.salvage_value && (
              <p className="mt-1 text-sm text-red-600">
                {errors.salvage_value.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Component</Button>
      </div>
    </form>
  )
}