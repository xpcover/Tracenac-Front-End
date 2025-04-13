import { RetirementReport } from "@/components/charts/RetirementReport"
import { BudgetVsActualReport } from "@/components/charts/BudgetVsActualReport"
import { DeprecationScheduleChart } from "@/components/charts/DeprecationScheduleChart"
import { InsuranceSummary } from "@/components/charts/InsuranceSummary"
import { MaintenanceChart } from "@/components/charts/MaintenanceChart"
import { UsageReport } from "@/components/charts/UsageReport"
import WorkProgressChart from "@/components/charts/WorkProgressChart"
import { AssetRegisterChart } from "@/components/charts/AssetRegisterChart"

function DashboardPage() {
  return (
    <>
    <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AssetRegisterChart />
        <DeprecationScheduleChart />
        <UsageReport />
        <MaintenanceChart />
        <InsuranceSummary/>
        <WorkProgressChart />
        <BudgetVsActualReport />
        <RetirementReport />
    </div>
    </>
  )
}

export default DashboardPage
