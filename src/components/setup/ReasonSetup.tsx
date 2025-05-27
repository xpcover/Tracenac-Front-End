import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import Select from 'react-select'
import Button from '../ui/Button'
import { Modal } from '../ui/Modal'
import Input from '../ui/Input'

interface Category {
  id: string
  name: string
  fields: Field[]
}

interface Field {
  id: string
  name: string
  type: string
  isDefault: boolean
  options?: string[] // Add options for select type fields
}

interface ReportType {
  _id: string
  name: string
}

interface AvailableField {
  name: string
  type: string
}

interface SystemGeneratedField {
  collection: string
  fields: string[]
}

const apiMapping: Record<string, string> = {
  partners: 'https://api.tracenac.com/api/partner',
  assets: 'https://api.tracenac.com/api/assets',
  users: 'https://api.tracenac.com/api/users',
  // Add more mappings as needed
}

export function ReasonSetup() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Warranty Expiration',
      fields: [
        { id: '1', name: 'Product Name', type: 'text', isDefault: true },
        { id: '2', name: 'Image Upload', type: 'upload', isDefault: true },
        { id: '3', name: 'Product Type', type: 'select', isDefault: true, options: ['Type A', 'Type B'] },
      ]
    }
  ])
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [selectedReportType, setSelectedReportType] = useState<string>('')
  const [availableFields, setAvailableFields] = useState<AvailableField[]>([])
  const [systemGeneratedFields, setSystemGeneratedFields] = useState<SystemGeneratedField[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSystemFieldModalOpen, setIsSystemFieldModalOpen] = useState(false)
  const [collections, setCollections] = useState<string[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>('')
  const [selectedCollectionFields, setSelectedCollectionFields] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<{ fieldName: string; collection: string }[]>([])
  const [selectedFields, setSelectedFields] = useState<{ fieldName: string; collection: string }[]>([])

  useEffect(() => {
    fetchReportTypes()
    fetchCollections()
  }, [])

  const fetchReportTypes = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/report/report-type', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch report types')
      }

      const data = await response.json()
      setReportTypes(data.data)
    } catch (error) {
      console.error('Error fetching report types:', error)
    }
  }

  const fetchCollections = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/assets/collections', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }

      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const fetchCollectionFields = async (collectionName: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch(`https://api.tracenac.com/api/assets/collection-field/${collectionName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch collection fields')
      }

      const data = await response.json()
      setAvailableFields(data)
    } catch (error) {
      console.error('Error fetching collection fields:', error)
    }
  }

  const addCategory = () => {
    setCategories([...categories, {
      id: Date.now().toString(),
      name: 'New Category',
      fields: []
    }])
  }

  const handleSubmit = async (categories: Category[]) => {
    const token = localStorage.getItem('token')
    const tenantId = localStorage.getItem('tenantId')

    // Add tenantId and selectedReportType to each category
    const categoriesWithTenantId = categories.map((category) => ({
      ...category,
      tenantId,
      reportType: selectedReportType,
    }))

    // Attach API endpoints to system-generated fields based on the collection
    const systemGeneratedFieldsWithApi = systemGeneratedFields.map((sysField) => ({
      ...sysField,
      apiEndpoint: apiMapping[sysField.collection] || null, // Map the collection to its API endpoint
    }))

    try {
      const response = await fetch('https://api.tracenac.com/api/assets/reasons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenantId, 
          reportType: selectedReportType,
          name: categoriesWithTenantId[0].name,
          fields: categoriesWithTenantId[0].fields,
          // Use the first category for submission
          systemGeneratedFields: systemGeneratedFieldsWithApi, // Include the API mapping
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit category')
      }

      const data = await response.json()
      console.log('Reason submission successful:', data)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error during Reason submission:', error)
      setErrorMessage(error.message)
      setShowFailureModal(true)
    }
  }

  const addField = (categoryId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          fields: [...category.fields, {
            id: Date.now().toString(),
            name: 'New Field',
            type: 'text',
            isDefault: false
          }]
        }
      }
      return category
    }))
  }

  const addOption = (categoryId: string, fieldId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          fields: category.fields.map(field => {
            if (field.id === fieldId) {
              return {
                ...field,
                options: [...(field.options || []), 'New Option']
              }
            }
            return field
          })
        }
      }
      return category
    }))
  }

  const removeOption = (categoryId: string, fieldId: string, optionIndex: number) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          fields: category.fields.map(field => {
            if (field.id === fieldId) {
              const newOptions = field.options?.filter((_, index) => index !== optionIndex)
              return { ...field, options: newOptions }
            }
            return field
          })
        }
      }
      return category
    }))
  }
  const handleSearchFields = async (query: string) => {
    if (!query) {
      setSearchResults([])
      return
    }
  
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }
  
    try {
      const response = await fetch(`https://api.tracenac.com/api/assets/search-fields?searchQuery=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Failed to fetch search fields')
      }
  
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error fetching search fields:', error)
    }
  }
  const handleSelectField = (field: { fieldName: string; collection: string }) => {
    // Avoid duplicates
    if (!selectedFields.some(f => f.fieldName === field.fieldName && f.collection === field.collection)) {
      setSelectedFields([...selectedFields, field])
    }
  }
  const handleAddSystemGeneratedField = () => {
    const newSystemGeneratedFields = selectedFields.map(field => ({
      collection: field.collection,
      fields: [field.fieldName],
    }))
  
    setSystemGeneratedFields([...systemGeneratedFields, ...newSystemGeneratedFields])
    setIsSystemFieldModalOpen(false)
    setSearchResults([])
    setSelectedFields([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center bg-white rounded-lg border p-4 space-y-4">
        <label style={{fontSize:'15px'}} className="block text-sm font-medium text-gray-700">Report Type</label>
        <select
        style={{ width: '50%',margin: '0 auto' }}
          value={selectedReportType}
          onChange={(e) => setSelectedReportType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a report type</option>
          {reportTypes.map((reportType) => (
            <option key={reportType._id} value={reportType._id}>
              {reportType.name}
            </option>
          ))}
        </select>
      </div>

      {categories.map(category => (
        <div key={category.id} className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={category.name}
              onChange={(e) => {
                setCategories(categories.map(c => 
                  c.id === category.id ? { ...c, name: e.target.value } : c
                ))
              }}
              className="text-lg font-medium border-none focus:ring-0"
            />
            <Button
              variant="ghost"
              onClick={() => setCategories(categories.filter(c => c.id !== category.id))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {category.fields.map(field => (
              <div key={field.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => {
                    setCategories(categories.map(c => {
                      if (c.id === category.id) {
                        return {
                          ...c,
                          fields: c.fields.map(f => 
                            f.id === field.id ? { ...f, name: e.target.value } : f
                          )
                        }
                      }
                      return c
                    }))
                  }}
                  className="flex-1 border-none focus:ring-0 bg-transparent"
                />
                <select
                  value={field.type}
                  onChange={(e) => {
                    setCategories(categories.map(c => {
                      if (c.id === category.id) {
                        return {
                          ...c,
                          fields: c.fields.map(f => 
                            f.id === field.id ? { ...f, type: e.target.value } : f
                          )
                        }
                      }
                      return c
                    }))
                  }}
                  className="border-none bg-transparent"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="select">Select</option>
                  <option value="upload">Upload</option>
                </select>
                {field.type === 'select' && (
                  <div className="flex flex-col space-y-2" style={{width:"250px"}}>
                    {field.options?.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            setCategories(categories.map(c => {
                              if (c.id === category.id) {
                                return {
                                  ...c,
                                  fields: c.fields.map(f => {
                                    if (f.id === field.id) {
                                      const newOptions = [...(f.options || [])]
                                      newOptions[index] = e.target.value
                                      return { ...f, options: newOptions }
                                    }
                                    return f
                                  })
                                }
                              }
                              return c
                            }))
                          }}
                          className="flex-1 border-none focus:ring-0 bg-transparent"
                        />
                        <Button
                          variant="ghost"
                          onClick={() => removeOption(category.id, field.id, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => addOption(category.id, field.id)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </Button>
                  </div>
                )}
                {!field.isDefault && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCategories(categories.map(c => {
                        if (c.id === category.id) {
                          return {
                            ...c,
                            fields: c.fields.filter(f => f.id !== field.id)
                          }
                        }
                        return c
                      }))
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {systemGeneratedFields.map((sysField, index) => (
              <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium">{sysField.collection}</p>
                  <ul className="list-disc pl-5">
                    {sysField.fields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSystemGeneratedFields(systemGeneratedFields.filter((_, i) => i !== index))
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={() => addField(category.id)} variant="ghost" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
          <Button onClick={() => setIsSystemFieldModalOpen(true)} variant="ghost" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add System Generated Field
          </Button>
        </div>
      ))}

      <Button onClick={addCategory} variant="ghost" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Reason
      </Button>
      <button
        onClick={() => handleSubmit(categories)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>

      {/* <Modal 
  isOpen={isSystemFieldModalOpen}
  onClose={() => setIsSystemFieldModalOpen(false)}
  title="Add System Generated Field"
>
  <div style={{ height: "300px" }} className="p-4 space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Search Field</label>
      <input
        type="text"
        placeholder="Type to search fields..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        onChange={(e) => handleSearchFields(e.target.value)}
      />
      <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto">
        {searchResults.map((result, index) => (
          <li
            key={`${result.collection}-${result.fieldName}-${index}`}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectField(result)}
          >
            {result.fieldName} ({result.collection})
          </li>
        ))}
      </ul>
    </div>

    <Button onClick={handleAddSystemGeneratedField} className="mt-4">
      Save Selected Fields
    </Button>
  </div>
</Modal> */}

      <Modal
        isOpen={showFailureModal}
        onClose={() => setShowFailureModal(false)}
        title="Error"
      >
        <div className="p-4">
          <p className="mt-2">Failed to submit category: {errorMessage}</p>
          <Button onClick={() => setShowFailureModal(false)} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>

     <Modal 
  isOpen={isSystemFieldModalOpen}
  onClose={() => setIsSystemFieldModalOpen(false)}
  title="Add System Generated Field"
>
  <div style={{ height: "300px" }} className="p-4 space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Search Field</label>
      <input
        type="text"
        placeholder="Type to search fields..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        onChange={(e) => handleSearchFields(e.target.value)}
      />
      <ul className="mt-2 border rounded-md max-h-40 overflow-y-auto">
        {searchResults.map((result, index) => (
          <li
            key={`${result.collection}-${result.fieldName}-${index}`}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectField(result)}
          >
            {result.fieldName} ({result.collection})
          </li>
        ))}
      </ul>
    </div>

    <Button onClick={handleAddSystemGeneratedField} className="mt-4">
      Save Selected Fields
    </Button>
  </div>
</Modal>
    </div>
  )
}