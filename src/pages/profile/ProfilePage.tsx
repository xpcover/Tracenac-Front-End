import { PageHeader } from '@/components/ui/PageHeader'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your account settings and preferences"
      />
      
      {/* Profile content will go here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Profile page content coming soon...</p>
      </div>
    </div>
  )
}