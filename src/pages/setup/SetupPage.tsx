import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { MenuArrangement } from '@/components/setup/MenuArrangement'
import { CategorySetup } from '@/components/setup/CategorySetup'
import { ReportBuilder } from '@/components/setup/ReportBuilder'
import { ReasonSetup } from '@/components/setup/ReasonSeup'
import ReportType from '@/components/setup/ReportType'

const TABS = [
  { id: 'menu', label: 'Menu Arrangement' },
  { id: 'reportType', label: 'Report Type' },
  { id: 'reasons', label: 'Reason Form' },
  { id: 'reports', label: 'Report Builder' },
  { id: 'categories', label: 'Categories & Fields' },
] as const

export default function SetupPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('menu')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Setup"
        description="Configure system settings and preferences"
      />

      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">
        {activeTab === 'menu' && <MenuArrangement />}
        {activeTab === 'reportType' && <ReportType />}
        {activeTab === 'reasons' && <ReasonSetup />}
        {activeTab === 'categories' && <CategorySetup />}
        {activeTab === 'reports' && <ReportBuilder />}
      </div>
    </div>
  )
}