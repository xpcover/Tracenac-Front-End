import {
    LayoutDashboard,
    Building2,
    DollarSign,
    // Link,
    // FilePlus,
    // PieChart,
    // Package,
    // Briefcase,
    // Settings,
    // FileText,
    // Box,
    // Boxes,
    // Puzzle,
    // Tag,
    // Building,
    // Building as BuildingIcon,
    // MapPin,
    // DollarSign,
    // Calculator,
    // Wallet,
    // Currency,
    // History,
    // Barcode,
    // TrendingDown,
    // KeyRound,
    // Construction,
    // Clock,
    // Users,
    // Shield,
    // Lock,
    // ShieldCheck,
  } from 'lucide-react'
  import { MenuItem } from './types'
import { PATHS } from '@/constants/paths'
  
  export const admintems: MenuItem[] = [
    { 
      icon: Building2, 
      label: 'Tenants', 
      to: PATHS.PRIVATE.TENANTS,
      requiredPermissions: ['VIEW_TENANTS']
    },
    { 
      icon: DollarSign, 
      label: 'Subscriptions', 
      to: PATHS.PRIVATE.SUBSCRIPTIONS,
      requiredPermissions: ['VIEW_SUBSCRIPTION']
    },
    // { 
    //   icon: Link,
    //   label: 'Short URLs',
    //   to: '/short-urls',
    //   requiredPermissions: ['SHORT_URLS']
    // },
    // {
    //   icon: FilePlus,
    //   label: 'Create Reports',
    //   to: '/create-reports',
    //   requiredPermissions: ['VIEW_CREATE_REPORTS'],
    //   children: [
    //     {
    //       icon: History,
    //       label: 'Add Asset History',
    //       to: '/create-reports/asset-history',
    //       requiredPermissions: ['ADD_ASSET_HISTORY']
    //     },
    //     {
    //       icon: Barcode,
    //       label: 'Add Barcode Scan',
    //       to: '/create-reports/barcode-scan',
    //       requiredPermissions: ['VIEW_BARCODE_SCANS']
    //     },
    //     {
    //       icon: TrendingDown,
    //       label: 'Add Impairment Record',
    //       to: '/create-reports/impairment',
    //       requiredPermissions: ['VIEW_IMPAIRMENT']
    //     },
    //     {
    //       icon: KeyRound,
    //       label: 'Add Lease',
    //       to: '/create-reports/lease',
    //       requiredPermissions: ['VIEW_LEASES']
    //     },
    //     {
    //       icon: Construction,
    //       label: 'Add WIP Asset',
    //       to: '/create-reports/wip-asset',
    //       requiredPermissions: ['VIEW_WIP_ASSETS']
    //     },
    //     {
    //       icon: Clock,
    //       label: 'Add Shift Usage',
    //       to: '/create-reports/shift-usage',
    //       requiredPermissions: ['VIEW_SHIFT_USAGE']
    //     }
    //   ]
    // },
    // { 
    //   icon: PieChart, 
    //   label: 'Reports', 
    //   to: '/reports',
    //   requiredPermissions: ['VIEW_REPORTS'],
    //   children: [
    //     {
    //       icon: History,
    //       label: 'Asset History',
    //       to: '/asset-history',
    //       requiredPermissions: ['VIEW_ASSET_HISTORY']
    //     },
    //     {
    //       icon: Barcode,
    //       label: 'Barcode Scans',
    //       to: '/barcode-scans',
    //       requiredPermissions: ['VIEW_BARCODE_SCANS']
    //     },
    //     {
    //       icon: TrendingDown,
    //       label: 'Impairment Records',
    //       to: '/impairment-records',
    //       requiredPermissions: ['VIEW_IMPAIRMENT']
    //     },
    //     {
    //       icon: KeyRound,
    //       label: 'Leases',
    //       to: '/leases',
    //       requiredPermissions: ['VIEW_LEASES']
    //     },
    //     {
    //       icon: Construction,
    //       label: 'WIP Assets',
    //       to: '/wip-assets',
    //       requiredPermissions: ['VIEW_WIP_ASSETS']
    //     },
    //     {
    //       icon: Clock,
    //       label: 'Shift Usage',
    //       to: '/shift-usage',
    //       requiredPermissions: ['VIEW_SHIFT_USAGE']
    //     }
    //   ]
    // },
    // {
    //   icon: Package,
    //   label: 'Manage Assets',
    //   to: '/assets',
    //   requiredPermissions:['VIEW_MANAGE_ASSETS'],
    //   children: [
    //     {
    //       icon: Boxes,
    //       label: 'Asset Categories',
    //       to: '/asset-categories',
    //       requiredPermissions: ['VIEW_ASSET_CATEGORIES']
    //     },
    //     {
    //       icon: Box,
    //       label: 'Assets',
    //       to: '/assets',
    //       requiredPermissions: ['VIEW_ASSETS']
    //     },
    //     {
    //       icon: Puzzle,
    //       label: 'Asset Components',
    //       to: '/asset-components',
    //       requiredPermissions: ['VIEW_ASSET_COMPONENTS']
    //     },
    //     {
    //       icon: Tag,
    //       label: 'Asset Labels',
    //       to: '/asset-labels',
    //       requiredPermissions: ['VIEW_ASSET_LABELS']
    //     },
    //     {
    //       icon: Building,
    //       label: 'Asset Blocks',
    //       to: '/asset-blocks',
    //       requiredPermissions: ['VIEW_ASSET_BLOCKS']
    //     }
    //   ]
    // },
    // {
    //   icon: Briefcase,
    //   label: 'Business Settings',
    //   to: '/business-settings',
    //   requiredPermissions: ['VIEW_BUSINESS_SETTINGS'],
    //   children: [
    //     {
    //       icon: BuildingIcon,
    //       label: 'Departments',
    //       to: '/departments',
    //       requiredPermissions: ['VIEW_DEPARTMENTS']
    //     },
    //     {
    //       icon: MapPin,
    //       label: 'Locations',
    //       to: '/locations',
    //       requiredPermissions: ['VIEW_LOCATIONS']
    //     },
    //     {
    //       icon: DollarSign,
    //       label: 'Cost Centres',
    //       to: '/cost-centres',
    //       requiredPermissions: ['VIEW_COST_CENTRES']
    //     },
    //     {
    //       icon: Calculator,
    //       label: 'Depreciation Records',
    //       to: '/depreciation-records',
    //       requiredPermissions: ['VIEW_DEPRECIATION']
    //     },
    //     {
    //       icon: Wallet,
    //       label: 'Budgets',
    //       to: '/budgets',
    //       requiredPermissions: ['VIEW_BUDGETS']
    //     },
    //     {
    //       icon: Currency,
    //       label: 'Forex Rates',
    //       to: '/forex-rates',
    //       requiredPermissions: ['VIEW_FOREX']
    //     }
    //   ]
    // },
    // { 
    //   icon: Settings, 
    //   label: 'Settings', 
    //   to: '/settings',
    //   requiredPermissions: ['VIEW_SETTINGS'],
    //   children: [
    //     {
    //       icon: Users,
    //       label: 'Users',
    //       to: '/users',
    //       requiredPermissions: ['VIEW_USERS']
    //     },
    //     {
    //       icon: Shield,
    //       label: 'Roles',
    //       to: '/roles',
    //       requiredPermissions: ['VIEW_ROLES']
    //     },
    //     {
    //       icon: Lock,
    //       label: 'Permissions',
    //       to: '/permissions',
    //       requiredPermissions: ['VIEW_PERMISSIONS']
    //     },
    //     {
    //       icon: ShieldCheck,
    //       label: 'Report Permissions',
    //       to: '/report-permissions',
    //       requiredPermissions: ['VIEW_REPORT_PERMISSIONS']
    //     }
    //   ]
    // },
    // { icon: FileText, label: 'Documentation', to: '/docs', requiredPermissions: ['VIEW_DOCUMENTATION'] },
  ]