import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import Button from '../ui/Button'
import { Modal } from '../ui/Modal'

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
}

export function CategorySetup() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'IT Equipment',
      fields: [
        { id: '1', name: 'Serial Number', type: 'text', isDefault: true },
        { id: '2', name: 'Purchase Date', type: 'date', isDefault: true },
      ]
    }
  ])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const addCategory = () => {
    setCategories([...categories, {
      id: Date.now().toString(),
      name: 'New Category',
      fields: []
    }])
  }

  const handleSubmit = async (categories: Category[]) => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('https://api.tracenac.com/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categories),
      })

      if (!response.ok) {
        throw new Error('Failed to submit category')
      }

      const data = await response.json()
      console.log('Category submission successful:', data)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error during category submission:', error)
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

  return (
    <div className="space-y-6">
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
                </select>
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

          <Button onClick={() => addField(category.id)} variant="ghost" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      ))}

      <Button onClick={addCategory} variant="ghost" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Category
      </Button>
      <button
        onClick={() => handleSubmit(categories)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <div className="p-4">
          <p className="mt-2">Category submission successful!</p>
          <Button onClick={() => setShowSuccessModal(false)} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>

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
    </div>
  )
}