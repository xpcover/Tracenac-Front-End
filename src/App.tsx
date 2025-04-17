import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SuperAdminLogInForm from './components/auth/SuperAdminForm';
import TenantLoginForm from './components/auth/TenantLogin';
import UserLoginForm from './components/auth/UserLogInForm';
import RequireAuth from './components/auth/RequireAuth';

import SetupPage from './pages/setup/SetupPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import TenantsPage from './pages/tenants/TenantsPage';
import UsersPage from './pages/users/UsersPage';
import RolesPage from './pages/roles/RolesPage';
import PermissionsPage from './pages/permissions/PermissionsPage';
import AssetCategoriesPage from './pages/asset-categories/AssetCategoriesPage';
import AssetBlocksPage from './pages/asset-blocks/AssetBlocksPage';
import DepartmentsPage from './pages/departments/DepartmentsPage';
import LocationsPage from './pages/locations/LocationsPage';
import CostCentresPage from './pages/cost-centres/CostCentresPage';
import AssetsPage from './pages/assets/AssetsPage';
import AssetDetailsPage from './pages/assets/AssetDetailsPage';
import AssetTimelinePage from './pages/assets/AssetTimelinePage';
import AssetComponentsPage from './pages/asset-components/AssetComponentsPage';
import DepreciationRecordsPage from './pages/depreciation-records/DepreciationRecordsPage';
import AssetHistoryPage from './pages/asset-history/AssetHistoryPage';
import ContractsPage from './pages/contracts/ContractsPage';
import BudgetsPage from './pages/budgets/BudgetsPage';
import ForexRatesPage from './pages/forex-rates/ForexRatesPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ShiftUsagePage from './pages/shift-usage/ShiftUsagePage';
import ReportsPage from './pages/reports/ReportsPage';
import ReportPermissionsPage from './pages/report-permissions/ReportPermissionsPage';
import AssetLabelsPage from './pages/asset-labels/AssetLabelsPage';
import BarcodeScansPage from './pages/barcode-scans/BarcodeScansPage';
import ImpairmentRecordsPage from './pages/impairment-records/ImpairmentRecordsPage';
import LeasesPage from './pages/leases/LeasesPage';
import WipAssetsPage from './pages/wip-assets/WipAssetsPage';
import ReportTemplateList from './pages/reports/templates/ReportTemplateList';
import ShortUrlsPage from './pages/short-urls/ShortUrlsPage';
import CreateShortUrlPage from './pages/short-urls/CreateShortUrlPage';
import BulkCreateUrlPage from './pages/short-urls/BulkCreateUrlPage';
import PartnersPage from './pages/partner/PartnerForm';
import PartnerList from './pages/partner/PartnerPage';
// Create Reports Pages
import CreateAssetHistoryPage from './pages/create-reports/CreateAssetHistoryPage';
import CreateBarcodeScanPage from './pages/create-reports/CreateBarcodeScanPage';
import CreateImpairmentRecordPage from './pages/create-reports/CreateImpairmentRecordPage';
import CreateLeasePage from './pages/create-reports/CreateLeasePage';
import CreateWipAssetPage from './pages/create-reports/CreateWipAssetPage';
import CreateShiftUsagePage from './pages/create-reports/CreateShiftUsagePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-login" element={<SuperAdminLogInForm />} />
        <Route path="/tenant-login" element={<TenantLoginForm />} />
        <Route path="/user-login" element={<UserLoginForm/>} /> 
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<div className="text-2xl font-bold">Welcome to the Dashboard</div>} />
          
          {/* Top Bar Menu Routes */}
          <Route path="setup" element={<SetupPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Main Menu Routes */}
          {/* <Route path="partner" element={<PartnersPage />} /> */}
          <Route path="partner-list" element={<PartnerList />} />

          <Route path="tenants" element={<TenantsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="asset-categories" element={<AssetCategoriesPage />} />
          <Route path="asset-blocks" element={<AssetBlocksPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="cost-centres" element={<CostCentresPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetDetailsPage />} />
          <Route path="assets/:id/timeline" element={<AssetTimelinePage />} />
          <Route path="asset-components" element={<AssetComponentsPage />} />
          <Route path="depreciation-records" element={<DepreciationRecordsPage />} />
          <Route path="asset-history" element={<AssetHistoryPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="forex-rates" element={<ForexRatesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="shift-usage" element={<ShiftUsagePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/templates" element={<ReportTemplateList />} />
          <Route path="report-permissions" element={<ReportPermissionsPage />} />
          <Route path="asset-labels" element={<AssetLabelsPage />} />
          <Route path="barcode-scans" element={<BarcodeScansPage />} />
          <Route path="impairment-records" element={<ImpairmentRecordsPage />} />
          <Route path="leases" element={<LeasesPage />} />
          <Route path="wip-assets" element={<WipAssetsPage />} />
          <Route path="short-urls" element={<ShortUrlsPage />} />
          <Route path="short-urls/create" element={<CreateShortUrlPage />} />
          <Route path="short-urls/bulk" element={<BulkCreateUrlPage />} />

          {/* Create Reports Routes */}
          <Route path="create-reports/asset-history" element={<CreateAssetHistoryPage />} />
          <Route path="create-reports/barcode-scan" element={<CreateBarcodeScanPage />} />
          <Route path="create-reports/impairment" element={<CreateImpairmentRecordPage />} />
          <Route path="create-reports/lease" element={<CreateLeasePage />} />
          <Route path="create-reports/wip-asset" element={<CreateWipAssetPage />} />
          <Route path="create-reports/shift-usage" element={<CreateShiftUsagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;