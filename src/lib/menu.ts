import {
  LayoutDashboard,
  Building2,
  Link,
  FilePlus,
  PieChart,
  Package,
  Briefcase,
  Settings,
  FileText,
  Box,
  Boxes,
  Puzzle,
  Tag,
  Building,
  Building as BuildingIcon,
  MapPin,
  DollarSign,
  Calculator,
  Wallet,
  Currency,
  History,
  Barcode,
  TrendingDown,
  KeyRound,
  Construction,
  Clock,
  Users,
  Shield,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { MenuItem } from './types'

export const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', requiredPermissions: ['VIEW_DASHBOARD'] },
  // { 
  //   icon: Building2, 
  //   label: 'Tenants', 
  //   to: '/tenants',
  //   requiredPermissions: ['VIEW_TENANTS']
  // },
  { 
    icon: Link,
    label: 'Short URLs',
    to: '/short-urls',
    requiredPermissions: ['SHORT_URLS'],
    children: [
      {
        icon: History,
        label: 'Create Single URL',
        to: '/short-urls/create',
        requiredPermissions: ['ADD_ASSET_HISTORY']
      },
      {
        icon: History,
        label: 'Create Bulk URL',
        to: '/short-urls/bulk',
        requiredPermissions: ['ADD_ASSET_HISTORY']
      },
    ]
  },
  {
    icon: FilePlus,
    label: 'Create Reports',
    to: '/create-reports/asset-history',
    requiredPermissions: ['VIEW_CREATE_REPORTS'],
    
      // {
      //   icon: Barcode,
      //   label: 'Add Barcode Scan',
      //   to: '/create-reports/barcode-scan',
      //   requiredPermissions: ['VIEW_BARCODE_SCANS']
      // },
      // {
      //   icon: TrendingDown,
      //   label: 'Add Impairment Record',
      //   to: '/create-reports/impairment',
      //   requiredPermissions: ['VIEW_IMPAIRMENT']
      // },
      // {
      //   icon: KeyRound,
      //   label: 'Add Lease',
      //   to: '/create-reports/lease',
      //   requiredPermissions: ['VIEW_LEASES']
      // },
      // {
      //   icon: Construction,
      //   label: 'Add WIP Asset',
      //   to: '/create-reports/wip-asset',
      //   requiredPermissions: ['VIEW_WIP_ASSETS']
      // },
      // {
      //   icon: Clock,
      //   label: 'Add Shift Usage',
      //   to: '/create-reports/shift-usage',
      //   requiredPermissions: ['VIEW_SHIFT_USAGE']
      // }
    
  },
  { 
    icon: PieChart, 
    label: 'Report List', 
    to: '/asset-history',
    requiredPermissions: ['VIEW_REPORTS'],
   
      // {
      //   icon: Barcode,
      //   label: 'Barcode Scans',
      //   to: '/barcode-scans',
      //   requiredPermissions: ['VIEW_BARCODE_SCANS']
      // },
      // {
      //   icon: TrendingDown,
      //   label: 'Impairment Records',
      //   to: '/impairment-records',
      //   requiredPermissions: ['VIEW_IMPAIRMENT']
      // },
      // {
      //   icon: KeyRound,
      //   label: 'Leases',
      //   to: '/leases',
      //   requiredPermissions: ['VIEW_LEASES']
      // },
      // {
      //   icon: Construction,
      //   label: 'WIP Assets',
      //   to: '/wip-assets',
      //   requiredPermissions: ['VIEW_WIP_ASSETS']
      // },
      // {
      //   icon: Clock,
      //   label: 'Shift Usage',
      //   to: '/shift-usage',
      //   requiredPermissions: ['VIEW_SHIFT_USAGE']
      // }
    
  },
  {
    icon: Package,
    label: 'Manage Assets',
    to: '/assets',
    requiredPermissions:['VIEW_MANAGE_ASSETS'],
    children: [
      {
        icon: Boxes,
        label: 'Asset Categories',
        to: '/asset-categories',
        requiredPermissions: ['VIEW_ASSET_CATEGORIES']
      },
      {
        icon: Box,
        label: 'Assets',
        to: '/assets',
        requiredPermissions: ['VIEW_ASSETS']
      },
      {
        icon: Puzzle,
        label: 'Asset Components',
        to: '/asset-components',
        requiredPermissions: ['VIEW_ASSET_COMPONENTS']
      },
      {
        icon: Tag,
        label: 'Asset Labels',
        to: '/asset-labels',
        requiredPermissions: ['VIEW_ASSET_LABELS']
      },
      {
        icon: Building,
        label: 'Asset Blocks',
        to: '/asset-blocks',
        requiredPermissions: ['VIEW_ASSET_BLOCKS']
      }
    ]
  },
  {
    icon: Briefcase,
    label: 'Business Settings',
    to: '/business-settings',
    requiredPermissions: ['VIEW_BUSINESS_SETTINGS'],
    children: [
      {
        icon: BuildingIcon,
        label: 'Departments',
        to: '/departments',
        requiredPermissions: ['VIEW_DEPARTMENTS']
      },
      {
        icon: MapPin,
        label: 'Locations',
        to: '/locations',
        requiredPermissions: ['VIEW_LOCATIONS']
      },
      {
        icon: DollarSign,
        label: 'Cost Centres',
        to: '/cost-centres',
        requiredPermissions: ['VIEW_COST_CENTRES']
      },
      {
        icon: Calculator,
        label: 'Depreciation Records',
        to: '/depreciation-records',
        requiredPermissions: ['VIEW_DEPRECIATION']
      },
      {
        icon: Wallet,
        label: 'Budgets',
        to: '/budgets',
        requiredPermissions: ['VIEW_BUDGETS']
      },
      {
        icon: Currency,
        label: 'Forex Rates',
        to: '/forex-rates',
        requiredPermissions: ['VIEW_FOREX']
      }
    ]
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    to: '/settings',
    requiredPermissions: ['VIEW_SETTINGS'],
    children: [
      {
        icon: Users,
        label: 'Partners',
        to: '/partner',
        requiredPermissions: ['VIEW_USERS']
      },
      {
        icon: Users,
        label: 'Partners List',
        to: '/partner-list',
        requiredPermissions: ['VIEW_USERS']
      },
      {
        icon: Users,
        label: 'Employees',
        to: '/users',
        requiredPermissions: ['VIEW_USERS']
      },
      {
        icon: Shield,
        label: 'Roles',
        to: '/roles',
        requiredPermissions: ['VIEW_ROLES']
      },
      {
        icon: Lock,
        label: 'Permissions',
        to: '/permissions',
        requiredPermissions: ['VIEW_PERMISSIONS']
      },
      {
        icon: ShieldCheck,
        label: 'Report Permissions',
        to: '/report-permissions',
        requiredPermissions: ['VIEW_REPORT_PERMISSIONS']
      }
    ]
  },
  { icon: FileText, label: 'Documentation', to: '/docs', requiredPermissions: ['VIEW_DOCUMENTATION'] },
]