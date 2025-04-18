import { RetirementReport } from "@/components/charts/RetirementReport"
import { BudgetVsActualReport } from "@/components/charts/BudgetVsActualReport"
import { DeprecationScheduleChart } from "@/components/charts/DeprecationScheduleChart"
import { InsuranceSummary } from "@/components/charts/InsuranceSummary"
import { MaintenanceChart } from "@/components/charts/MaintenanceChart"
import { UsageReport } from "@/components/charts/UsageReport"
import WorkProgressChart from "@/components/charts/WorkProgressChart"
import { AssetRegisterChart } from "@/components/charts/AssetRegisterChart"
import ContractReport from "@/components/charts/ContractReport"
import ROIChart from "@/components/charts/ROIChart"

function DashboardPage() {
  return (
    <>
    <h1 className="text-2xl font-bold mb-10">Dashboard</h1>
        <ROIChart />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <AssetRegisterChart />
        <DeprecationScheduleChart />
        <UsageReport />
        <MaintenanceChart />
        <InsuranceSummary/>
        <WorkProgressChart />
        <BudgetVsActualReport />
        <RetirementReport />
        <ContractReport />
    </div>
    </>
  )
}

export default DashboardPage
