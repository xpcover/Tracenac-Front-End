import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Modal } from '../ui/Modal'

interface Report {
  id: string
  name: string
  image: string
  placement: string
  reportFor: string
  assetCategories: string[]
  reason: string
  reportType: string
}

interface Category {
  _id: string
  name: string
}

interface Reason {
  _id: string
  name: string
}

interface ReportType {
  _id: string
  name: string
}

export function ReportBuilder() {
  const [reports, setReports] = useState<Report[]>([])
  const [currentReport, setCurrentReport] = useState<Report>({
    id: Date.now().toString(),
    name: '',
    image: 'test',
    placement: '',
    reportFor: '',
    assetCategories: [],
    reason: '',
    reportType: '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [reasons, setReasons] = useState<Reason[]>([])
  const [reportTypes, setReportTypes] = useState<ReportType[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchReportTypes()
  }, [])

  const fetchCategories = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found in local storage')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/category', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchReportTypes = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found in local storage')
      return
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/report/report-type', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  const fetchReasons = async (reportTypeId: string) => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found in local storage')
      return
    }

    try {
      const response = await fetch(`https://api.tracenac.com/api/assets/reasons/${reportTypeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reasons')
      }

      const data = await response.json()
      setReasons(data)
    } catch (error) {
      console.error('Error fetching reasons:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }))

    if (name === 'reportType') {
      fetchReasons(value)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://api.tracenac.com/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setCurrentReport((prev) => ({
        ...prev,
        image: data.imageUrl, // Adjust this based on your API response structure
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleAddReport = async () => {
    const token = localStorage.getItem('token')
    const tenantId = localStorage.getItem('tenantId')

    const reportData = {
      ...currentReport,
      tenantId,
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/assets/report-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(reportData),
      })

      if (!response.ok) {
        throw new Error('Failed to add report template')
      }

      const data = await response.json()
      console.log('Report template added successfully:', data)

      setReports([...reports, currentReport])
      setCurrentReport({
        id: Date.now().toString(),
        name: '',
        image: 'test',
        placement: '',
        reportFor: '',
        assetCategories: [],
        reason: '',
        reportType: '',
      })
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error adding report template:', error)
      setErrorMessage(error.message)
      setShowFailureModal(true)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Report Name</label>
        <Input
          type="text"
          name="name"
          value={currentReport.name}
          onChange={handleInputChange}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Image/Icon</label>
        <div className="mt-1 flex items-center gap-4">
          {/* {currentReport.image && (
            <img
              src={currentReport.image}
              alt="Report icon"
              className="h-12 w-12 object-cover rounded-md"
            />
          )} */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Placement</label>
        <Input
          type="text"
          name="placement"
          value={currentReport.placement}
          onChange={handleInputChange}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report for</label>
        <select
          name="reportFor"
          value={currentReport.reportFor}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          <option value="Customers">Customers</option>
          <option value="Employees">Employees</option>
          <option value="Vendors">Vendors</option>
          <option value="Partners">Partners</option>
          <option value="Common">Common</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Assets</label>
        <select
          name="assetCategories"
          value={currentReport.assetCategories}
          onChange={(e) =>
            setCurrentReport({
              ...currentReport,
              assetCategories: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Report Type</label>
        <select
          name="reportType"
          value={currentReport.reportType}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          {reportTypes.map((reportType) => (
            <option key={reportType._id} value={reportType._id}>
              {reportType.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <select
          name="reason"
          value={currentReport.reason}
          onChange={handleInputChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select</option>
          {reasons.map((reason) => (
            <option key={reason._id} value={reason._id}>
              {reason.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={handleAddReport} className="mt-4">
        Save Report
      </Button>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <div className="p-4">
          <p className="mt-2">Report template added successfully!</p>
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
          <p className="mt-2">Failed to add report template: {errorMessage}</p>
          <Button onClick={() => setShowFailureModal(false)} className="mt-4">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}