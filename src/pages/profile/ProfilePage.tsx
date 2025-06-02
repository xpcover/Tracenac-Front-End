import Button from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { removeUserInfo } from '@/redux/slices/authSlice'
import { LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(removeUserInfo())
    navigate('/login')
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Profile page content coming soon...</p>
      </div>

      <Button onClick={handleLogout}><LogOut className='w-4 mr-1' />Logout</Button>
    </div>
  )
}