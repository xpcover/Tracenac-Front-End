import { useMutation, useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { axiosInstance } from '@/config/axiosInstance'

interface Field {
  id: string
  name: string
  type: string
  options?: string[]
}

interface Reason {
  _id: string
  name: string
  fields: Field[]
}

interface ReportTemplate {
  _id: string
  tenantId: string
  id: string
  name: string
  image: string
  placement: string
  reportFor: string
  assetCategories: string[]
  reason: Reason
}

interface User {
  id: string
  name: string
}

const createAssetHistorySchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  reportTemplateId: z.string().min(1, 'Report template is required'),
  useCurrentLocation: z.boolean().default(false),
  latitude: z.number().nullable().default(null),
  longitude: z.number().nullable().default(null),
  address: z.string().optional(),
  assignedTo: z.boolean().default(false),
  userId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
})

type CreateAssetHistoryFormData = z.infer<typeof createAssetHistorySchema> & {
  dynamicFields: Record<string, any>
  attachments: File[]
}

export default function CreateAssetHistoryPage() {
  const navigate = useNavigate()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAssetHistoryFormData>({
    resolver: zodResolver(createAssetHistorySchema),
    defaultValues: {
      useCurrentLocation: false,
      assignedTo: false,
      latitude: null,
      longitude: null,
      dynamicFields: {},
    },
  })

  // Watch values for conditional rendering
  const useCurrentLocation = watch('useCurrentLocation')
  const assignedTo = watch('assignedTo')
  const reportTemplateId = watch('reportTemplateId')

  // Fetch report templates with React Query
  const { data: reportTemplates = [] } = useQuery<ReportTemplate[]>({
    queryKey: ['reportTemplates'],
    queryFn: async () => {
      const response = await axiosInstance.get('/assets/report-template')
      return response.data
    },
  })

  // Fetch users with React Query (only when assignedTo is true)
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/')
      return response.data.msg
    },
    enabled: assignedTo,
  })

  // Get the selected report template to access its fields
  const selectedReportTemplate = reportTemplates.find(
    (rt) => rt._id === reportTemplateId
  )
  const reasonFields = selectedReportTemplate?.reason.fields || []

  // Mutation for submitting the form
  const createAssetHistoryMutation = useMutation({
    mutationFn: async (data: CreateAssetHistoryFormData) => {
      const formData = new FormData()

      formData.append('tenantId', localStorage.getItem('tenantId') || '')
      formData.append('assetId', data.assetId)
      formData.append('date', data.date)
      formData.append('reportType', data.reportTemplateId)
      if (data.address) formData.append('address', data.address)
      if (data.userId) formData.append('assignedTo', data.userId)
      if (data.latitude) formData.append('latitude', data.latitude.toString())
      if (data.longitude) formData.append('longitude', data.longitude.toString())

      // Append dynamic fields
      reasonFields.forEach((field) => {
        const value = data.dynamicFields[field.id]
        if (value !== undefined) {
          formData.append(`reasonFields[${field.name}]`, value)
        }
      })

      // Append files
      data.attachments?.forEach((file) => {
        formData.append('attachments', file)
      })

      return axiosInstance.post('/assets/asset-history', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    onSuccess: () => {
      navigate('/asset-history')
    },
  })

  const onSubmit = (data: CreateAssetHistoryFormData) => {
    createAssetHistoryMutation.mutate(data)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue('attachments', Array.from(e.target.files))
    }
  }

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    setValue(`dynamicFields.${fieldId}`, value)
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude)
          setValue('longitude', position.coords.longitude)
        },
        (error) => {
          console.error('Error getting location: ', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Report" description="Record new report entry">
        <Button variant="ghost" onClick={() => navigate('/asset-history')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter Asset ID"
                  className="mt-1"
                  {...register('assetId')}
                  error={errors.assetId?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Template
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...register('reportTemplateId')}
                >
                  <option value="">Select a report template</option>
                  {reportTemplates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                {errors.reportTemplateId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.reportTemplateId.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Input
                type="date"
                className="mt-1"
                {...register('date')}
                error={errors.date?.message}
              />
            </div>

            {/* Dynamic fields from selected report template */}
            {reasonFields.map((field) => (
              <div key={field.id} className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.name}
                </label>
                {field.type === 'text' && (
                  <Input
                    type="text"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    type="number"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === 'select' && (
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  >
                    <option value="">Select {field.name}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === 'upload' && (
                  <input
                    type="file"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) =>
                      handleDynamicFieldChange(
                        field.id,
                        e.target.files?.[0]
                      )
                    }
                  />
                )}
                {field.type === 'date' && (
                  <Input
                    type="date"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}



            {useCurrentLocation && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    className="mt-1"
                    {...register('latitude', { valueAsNumber: true })}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    className="mt-1"
                    {...register('longitude', { valueAsNumber: true })}
                    readOnly
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <Input
                    type="text"
                    className="mt-1"
                    {...register('address')}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-2"
                    onClick={handleGetCurrentLocation}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Current Location
                  </Button>
                </div>
              </div>
            )}

            {/* Assigned to section */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="assigned-to"
                {...register('assignedTo')}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="assigned-to"
                className="text-sm font-medium text-gray-700"
              >
                Assigned To
              </label>
            </div>

            {assignedTo && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  {...register('userId')}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/asset-history')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAssetHistoryMutation.isPending}
              >
                {createAssetHistoryMutation.isPending
                  ? 'Creating...'
                  : 'Create History Entry'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}