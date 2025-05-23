import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, MapPin, FileText } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import axios from 'axios'
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

export default function CreateAssetHistoryPage() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<File[]>([])
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [assetId, setAssetId] = useState('')
  const [assets,setAssets]= useState([])
  const [changeType, setChangeType] = useState('')
  const [details, setDetails] = useState('')
  const [date, setDate] = useState('')
  const [changedBy, setChangedBy] = useState('')
  const [address, setAddress] = useState('')
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([])
  const [selectedReportTemplate, setSelectedReportTemplate] = useState<string>('')
  const [reasonFields, setReasonFields] = useState<Field[]>([])
  const [assignedTo, setAssignedTo] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [dynamicFieldValues, setDynamicFieldValues] = useState<{ [key: string]: any }>({})
  const [systemFieldValues, setSystemFieldValues] = useState<{ [key: string]: any }>({})
  const [systemFieldOptions, setSystemFieldOptions] = useState<{ [key: string]: any[] }>({})
  const [systemGeneratedFields, setSystemGeneratedFields] = useState<SystemGeneratedField[]>([])

  useEffect(() => {
    fetchReportTemplates()
    fetchAssets()
  }, [])

  useEffect(() => {
    if (assignedTo) {
      fetchUsers()
    }
  }, [assignedTo])

  const fetchReportTemplates = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/assets/report-template', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch report templates')
      }

      const data = await response.json()
      setReportTemplates(data) // Assuming the API response is an array of report templates
    } catch (error) {
      console.error('Error fetching report templates:', error)
    }
  }


  const fetchAssets = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await axiosInstance.get('/assets', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = response.data.msg
      setAssets(data) 
    } catch (error) {
      console.error('Error fetching report templates:', error)
    }
  }

  console.log("Asset", assetId)

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/user/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.msg) // Assuming the API response is an array of users
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleReportTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const reportTemplateId = e.target.value
    // const assetId = e.target.value
    // setSelectedAssetId(assetId)
    setSelectedReportTemplate(reportTemplateId)
    const reportTemplate = reportTemplates.find(rt => rt._id === reportTemplateId)
    setReasonFields(reportTemplate ? reportTemplate.reason.fields : [])
    setSystemGeneratedFields(reportTemplate.reason.systemGeneratedFields)

  }

  const handleAssetId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetId = e.target.value
    setAssetId(assetId)
  }

  const handleSystemFieldSearch = async (collection: string, query: string, apiEndpoint: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }
  
    try {
      const response = await fetch(`${apiEndpoint}?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Failed to fetch system field data')
      }
  
      const data = await response.json()
      setSystemFieldOptions(prevOptions => ({
        ...prevOptions,
        [collection]: data.msg.map((item: any) => ({
          value: item.partnerId || item.assetId || item._id, // Use partnerId or _id as the value
          label: item.partnerName || item.name, // Use partnerName or name as the label
          relatedFields: item, // Store the entire object for related fields
        })),
      }))
    } catch (error) {
      console.error('Error fetching system field data:', error)
    }
  }
  const handleSystemFieldSelect = (collection: string, selectedOption: any) => {
    if (!selectedOption) return
  
    // Update the selected value and related fields
    setSystemFieldValues(prevValues => ({
      ...prevValues,
      [collection]: {
        ...selectedOption.relatedFields, // Store all related fields
      },
    }))
  }

  const handleDynamicFieldChange = (fieldId: string, value: any) => {
    setDynamicFieldValues(prevValues => ({
      ...prevValues,
      [fieldId]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  
    const token = localStorage.getItem('token')
  
    const dynamicFields = reasonFields.map(field => ({
      name: field.name,
      value: dynamicFieldValues[field.id],
    }))
  
    const systemFields = systemGeneratedFields.map(field => ({
      collection: field.collection,
      values: systemFieldValues[field.collection],
    }))
  
    const assetHistory = {
      tenantId: localStorage.getItem('tenantId'),
      assetId,
      date,
      latitude,
      longitude,
      address,
      reportType: selectedReportTemplate,
      attachments: files.map(file => file.name), // Assuming file names are used as attachments
      assignedTo: selectedUser,
      reasonFields: dynamicFields,
      systemFields, // Include system-generated fields
    }
  
    axios.post('https://api.tracenac.com/api/assets/create-asset-report', assetHistory, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res: { data: unknown }) => {
        alert('Asset History created successfully')
        navigate('/asset-history')
      })
      .catch((err: unknown) => console.error(err))
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location: ", error)
        }
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Create Report" description="Record new report entry">
        <Button variant="ghost" onClick={() => navigate("/asset-history")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </PageHeader>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Asset ID
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={assetId}
                  onChange={handleAssetId} // ✅ correct place
                >
                  <option value="">Select an asset</option>
                  {assets.map((asset) => (
                    <option key={asset._id} value={asset.assetId}>
                      {asset.assetId}
                    </option>
                  ))}
                </select>
                {/* <Input
                  type="text"
                  required
                  placeholder="Enter Asset ID"
                  className="mt-1"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                /> */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Report Template
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedReportTemplate}
                  onChange={handleReportTemplateChange}
                >
                  <option value="">Select a report template</option>
                  {reportTemplates.map((template) => (
                    <option key={template._id} value={template.name}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {reasonFields.map((field) => (
              <div key={field.id} className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.name}
                </label>
                {field.type === "text" && (
                  <Input
                    type="text"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    value={dynamicFieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === "number" && (
                  <Input
                    type="number"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    value={dynamicFieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
                {field.type === "select" && (
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={dynamicFieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
                {field.type === "upload" && (
                  <input
                    type="file"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.files?.[0])
                    }
                  />
                )}
                {field.type === "date" && (
                  <Input
                    type="date"
                    className="mt-1"
                    placeholder={`Enter ${field.name}`}
                    value={dynamicFieldValues[field.id] || ""}
                    onChange={(e) =>
                      handleDynamicFieldChange(field.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}

            {systemGeneratedFields.map((field) => (
              <div key={field.collection} className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  {field.collection}
                </label>
                {/* Combined search and dropdown using <datalist> */}
                <input
                  type="text"
                  list={`${field.collection}-options`}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`Search ${field.fields[0]}`}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedOption = systemFieldOptions[
                      field.collection
                    ]?.find((option) => option.value === selectedValue);
                    handleSystemFieldSelect(field.collection, selectedOption);
                  }}
                  onInput={(e) =>
                    handleSystemFieldSearch(
                      field.collection,
                      e.target.value,
                      field.apiEndpoint
                    )
                  }
                />
                <datalist id={`${field.collection}-options`}>
                  {systemFieldOptions[field.collection]?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </datalist>

                {/* Render remaining fields */}
                {field.fields.slice(1).map((subField) => (
                  <div key={subField} className="mt-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {subField}
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={`Enter ${subField}`}
                      value={
                        systemFieldValues[field.collection]?.[subField] || ""
                      }
                      readOnly // Make related fields read-only
                    />
                  </div>
                ))}
              </div>
            ))}

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="use-location"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="use-location"
                className="text-sm font-medium text-gray-700"
              >
                Include Location
              </label>
            </div>

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
                    value={latitude ?? ""}
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
                    value={longitude ?? ""}
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="assigned-to"
                checked={assignedTo}
                onChange={(e) => setAssignedTo(e.target.checked)}
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
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
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
                onClick={() => navigate("/asset-history")}
              >
                Cancel
              </Button>
              <Button type="submit">Create History Entry</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}