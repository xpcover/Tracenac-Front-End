import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage application settings and preferences"
      />
      
      {/* Settings content will go here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Settings page content coming soon...</p>
      </div>
    </div>
  )
}