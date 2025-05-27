/* eslint-disable react-refresh/only-export-components */
// src/routes/privateRoutes.tsx
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { PrivateRoutesWithLayout, RouteConfig } from '@/lib/types';

// Layout
const Layout = lazy(() => import('../components/layout/Layout'));

// Auth
const RequireAuth = lazy(() => import('../components/auth/RequireAuth'));

// Pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const SetupPage = lazy(() => import('../pages/setup/SetupPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const PartnerList = lazy(() => import('../pages/partner/PartnerPage'));
const TenantsPage = lazy(() => import('../pages/tenants/TenantsPage'));
const UsersPage = lazy(() => import('../pages/users/UsersPage'));
const RolesPage = lazy(() => import('../pages/roles/RolesPage'));
const PermissionsPage = lazy(() => import('../pages/permissions/PermissionsPage'));
const AssetCategoriesPage = lazy(() => import('../pages/asset-categories/AssetCategoriesPage'));
const AssetBlocksPage = lazy(() => import('../pages/asset-blocks/AssetBlocksPage'));
const DepartmentsPage = lazy(() => import('../pages/departments/DepartmentsPage'));
const LocationsPage = lazy(() => import('../pages/locations/LocationsPage'));
const CostCentresPage = lazy(() => import('../pages/cost-centres/CostCentresPage'));
const AssetsPage = lazy(() => import('../pages/assets/AssetsPage'));
const AddEditAssetPage = lazy(() => import('../pages/assets/AddEditAsset'));
const AssetDetailsPage = lazy(() => import('../pages/assets/AssetDetailsPage'));
const AssetTimelinePage = lazy(() => import('../pages/assets/AssetTimelinePage'));
const AssetComponentsPage = lazy(() => import('../pages/asset-components/AssetComponentsPage'));
const DepreciationRecordsPage = lazy(() => import('../pages/depreciation-records/DepreciationRecordsPage'));
const AssetHistoryPage = lazy(() => import('../pages/asset-history/AssetHistoryPage'));
const ContractsPage = lazy(() => import('../pages/contracts/ContractsPage'));
const BudgetsPage = lazy(() => import('../pages/budgets/BudgetsPage'));
const ForexRatesPage = lazy(() => import('../pages/forex-rates/ForexRatesPage'));
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'));
const ShiftUsagePage = lazy(() => import('../pages/shift-usage/ShiftUsagePage'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage'));
const ReportTemplateList = lazy(() => import('../pages/reports/templates/ReportTemplateList'));
const ReportPermissionsPage = lazy(() => import('../pages/report-permissions/ReportPermissionsPage'));
const BarcodeScansPage = lazy(() => import('../pages/barcode-scans/BarcodeScansPage'));
const ImpairmentRecordsPage = lazy(() => import('../pages/impairment-records/ImpairmentRecordsPage'));
const LeasesPage = lazy(() => import('../pages/leases/LeasesPage'));
const WipAssetsPage = lazy(() => import('../pages/wip-assets/WipAssetsPage'));
const ShortUrlsPage = lazy(() => import('../pages/short-urls/ShortUrlsPage'));
const CreateShortUrlPage = lazy(() => import('../pages/short-urls/CreateShortUrlPage'));
const EditShortURLPage = lazy(() => import('../pages/short-urls/EditShortUrlPage'));
const BulkUrlListPage = lazy(() => import('../pages/bulk-urls/BulkUrlListPage'));
const BulkCreateUrlPage = lazy(() => import('../pages/bulk-urls/BulkCreateUrlPage'));
const BulkUrlEditPage = lazy(() => import('../pages/bulk-urls/BulkUrlEditPage'));
const BarCodeGenerate = lazy(() => import('../pages/generate-barcode/BarCodeGenerate'));
const Map = lazy(() => import('../pages/leaflet-map/Map'));
const CreateAssetHistoryPage = lazy(() => import('../pages/create-reports/CreateAssetHistoryPage'));
const CreateBarcodeScanPage = lazy(() => import('../pages/create-reports/CreateBarcodeScanPage'));
const CreateImpairmentRecordPage = lazy(() => import('../pages/create-reports/CreateImpairmentRecordPage'));
const CreateLeasePage = lazy(() => import('../pages/create-reports/CreateLeasePage'));
const CreateWipAssetPage = lazy(() => import('../pages/create-reports/CreateWipAssetPage'));
const CreateShiftUsagePage = lazy(() => import('../pages/create-reports/CreateShiftUsagePage'));
const PackChain = lazy(() => import('../pages/pack-chain/PackChain'));
export const privateRoutes: RouteConfig[] = [
  {
    path: PATHS.PRIVATE.DASHBOARD,
    element: <DashboardPage />,
  },
  {
    path: PATHS.PRIVATE.SETUP,
    element: <SetupPage />,
  },
  {
    path: PATHS.PRIVATE.SETTINGS,
    element: <SettingsPage />,
  },
  {
    path: PATHS.PRIVATE.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: PATHS.PRIVATE.PARTNER_LIST,
    element: <PartnerList />,
  },
  {
    path: PATHS.PRIVATE.TENANTS,
    element: <TenantsPage />,
  },
  {
    path: PATHS.PRIVATE.USERS,
    element: <UsersPage />,
  },
  {
    path: PATHS.PRIVATE.ROLES,
    element: <RolesPage />,
  },
  {
    path: PATHS.PRIVATE.PERMISSIONS,
    element: <PermissionsPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_CATEGORIES,
    element: <AssetCategoriesPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_BLOCKS,
    element: <AssetBlocksPage />,
  },
  {
    path: PATHS.PRIVATE.DEPARTMENTS,
    element: <DepartmentsPage />,
  },
  {
    path: PATHS.PRIVATE.LOCATIONS,
    element: <LocationsPage />,
  },
  {
    path: PATHS.PRIVATE.COST_CENTRES,
    element: <CostCentresPage />,
  },
  {
    path: PATHS.PRIVATE.ASSETS,
    element: <AssetsPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_ADD,
    element: <AddEditAssetPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_EDIT,
    element: <AddEditAssetPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_DETAILS,
    element: <AssetDetailsPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_TIMELINE,
    element: <AssetTimelinePage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_COMPONENTS,
    element: <AssetComponentsPage />,
  },
  {
    path: PATHS.PRIVATE.DEPRECIATION_RECORDS,
    element: <DepreciationRecordsPage />,
  },
  {
    path: PATHS.PRIVATE.ASSET_HISTORY,
    element: <AssetHistoryPage />,
  },
  {
    path: PATHS.PRIVATE.CONTRACTS,
    element: <ContractsPage />,
  },
  {
    path: PATHS.PRIVATE.BUDGETS,
    element: <BudgetsPage />,
  },
  {
    path: PATHS.PRIVATE.FOREX_RATES,
    element: <ForexRatesPage />,
  },
  {
    path: PATHS.PRIVATE.NOTIFICATIONS,
    element: <NotificationsPage />,
  },
  {
    path: PATHS.PRIVATE.SHIFT_USAGE,
    element: <ShiftUsagePage />,
  },
  {
    path: PATHS.PRIVATE.REPORTS,
    element: <ReportsPage />,
  },
  {
    path: PATHS.PRIVATE.REPORT_TEMPLATES,
    element: <ReportTemplateList />,
  },
  {
    path: PATHS.PRIVATE.REPORT_PERMISSIONS,
    element: <ReportPermissionsPage />,
  },
  {
    path: PATHS.PRIVATE.BARCODE_SCANS,
    element: <BarcodeScansPage />,
  },
  {
    path: PATHS.PRIVATE.IMPAIRMENT_RECORDS,
    element: <ImpairmentRecordsPage />,
  },
  {
    path: PATHS.PRIVATE.LEASES,
    element: <LeasesPage />,
  },
  {
    path: PATHS.PRIVATE.WIP_ASSETS,
    element: <WipAssetsPage />,
  },
  {
    path: PATHS.PRIVATE.SHORT_URLS,
    element: <ShortUrlsPage />,
  },
  {
    path: PATHS.PRIVATE.SHORT_URLS_CREATE,
    element: <CreateShortUrlPage />,
  },
  {
    path: PATHS.PRIVATE.SHORT_URLS_EDIT,
    element: <EditShortURLPage />,
  },
  {
    path: PATHS.PRIVATE.BULK_URLS,
    element: <BulkUrlListPage />,
  },
  {
    path: PATHS.PRIVATE.BULK_URLS_CREATE,
    element: <BulkCreateUrlPage />,
  },
  {
    path: PATHS.PRIVATE.BULK_URLS_EDIT,
    element: <BulkUrlEditPage />,
  },
  {
    path: PATHS.PRIVATE.GENERATE_BARCODE,
    element: <BarCodeGenerate />,
  },
  {
    path: PATHS.PRIVATE.MAP,
    element: <Map />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.ASSET_HISTORY,
    element: <CreateAssetHistoryPage />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.BARCODE_SCAN,
    element: <CreateBarcodeScanPage />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.IMPAIRMENT,
    element: <CreateImpairmentRecordPage />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.LEASE,
    element: <CreateLeasePage />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.WIP_ASSET,
    element: <CreateWipAssetPage />,
  },
  {
    path: PATHS.PRIVATE.CREATE_REPORTS.SHIFT_USAGE,
    element: <CreateShiftUsagePage />,
  },
  {
    path: PATHS.PRIVATE.ANALYZE_PACK,
    element: <PackChain />,
  }
];

export const privateRoutesWithLayout: PrivateRoutesWithLayout = {
  path: '/',
  element: (
    <RequireAuth>
      <Layout />
    </RequireAuth>
  ),
  children: [
    { index: true, element: <Navigate to={PATHS.PRIVATE.DASHBOARD} replace /> },
    ...privateRoutes,
  ],
};