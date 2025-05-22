import { z } from 'zod'
import { DivideIcon as LucideIcon } from 'lucide-react'
import { ReactNode } from 'react';
import { IndexRouteProps, PathRouteProps, RouteProps } from 'react-router-dom';

export type RouteConfig = {
  path?: string;
  element?: ReactNode;
  children?: RouteConfig[];
  index?: boolean;
} & Omit<PathRouteProps | IndexRouteProps, 'path' | 'element' | 'children'>;

export type PrivateRouteProps = {
  children: ReactNode;
};

export type PrivateRoutesWithLayout = Omit<RouteProps, 'element' | 'children'> & {
  element: ReactNode;
  children: RouteConfig[];
};

// Base interfaces
export interface MenuItem {
  icon: typeof LucideIcon
  label: string
  to: string
  requiredPermissions?: string[]
  children?: MenuItem[]
}

export interface UserRole {
  role_id: string
  role_name: string
  permissions: string[]
}

export interface Role {
  id: string;
  name: string;
  permissions: { [key: string]: boolean };
}
export interface AuthUser {
  user_id: string
  username: string
  roles: UserRole[]
}

// Entity interfaces
export interface Tenant {
  tenant_id: string
  tenant_name: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  tenant_id: string
  name: string
  phone: string
  userRole:string
  username: string
  password: string
  first_name: string
  last_name: string
  email: string
  is_active: boolean
  createdAt: string
}

export interface Role {
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Permission {
  permission_id: string
  permission_name: string
  description: string
  created_at: string
  updated_at: string
}

export interface AssetCategory {
  category_id: string
  tenant_id: string
  category_name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface AssetBlock {
  block_id: string
  tenant_id: string
  block_name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Department {
  tenantId: string
  departmentName: string
  createdAt: string
  updatedAt: string
}

export interface Location {
  location_id: string
  tenant_id: string
  location_name: string
  address: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export interface Budget {
  budget_id: string
  tenant_id: string
  assetId: string
  fiscal_year: string
  budget_amount: string
  actual_amount: string
  variance: number
  createdAt: string
  createdBy: string
}


export interface CostCentre {
  tenant_id: string
  costCentreName: string
  description: string
  created_at: string
  updated_at: string
}

export interface Template {
  id: string;
  name: string;
}

// Zod schemas for form validation
export const assetSchema = z.object({
  asset_code: z.string().min(1, 'Asset code is required'),
  assetName: z.string().min(1, 'Asset name is required'),
  asset_type: z.string().min(1, 'Asset type is required'),
  image_url: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  block_id: z.string().min(1, 'Block is required'),
  department_id: z.string().min(1, 'Department is required'),
  location_id: z.string().min(1, 'Location is required'),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  cost_centre_id: z.string().min(1, 'Cost centre is required'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  purchase_cost: z.number().min(0, 'Purchase cost must be positive'),
  purchase_currency: z.string().min(1, 'Currency is required'),
  exchange_rate: z.number().min(0, 'Exchange rate must be positive'),
  current_value: z.number().min(0, 'Current value must be positive'),
  depreciation_method: z.string().min(1, 'Depreciation method is required'),
  depreciation_rate: z.number().min(0, 'Depreciation rate must be positive'),
  useful_life: z.number().min(0, 'Useful life must be positive'),
  salvage_value: z.number().min(0, 'Salvage value must be positive'),
  lease_end_date: z.string().nullable(),
  warranty_end_date: z.string().nullable(),
  insurance_end_date: z.string().nullable(),
  amc_end_date: z.string().nullable(),
  market_valuation: z.number().min(0, 'Market valuation must be positive'),
  status: z.string().min(1, 'Status is required'),
  barcode: z.string().nullable(),
  impairment_value: z.number().min(0, 'Impairment value must be positive'),
  notes: z.string().nullable(),
  assetId: z.string().optional(),
})

export const assetComponentSchema = z.object({
  assetId: z.string().min(1, 'Asset ID is required'),
  parent_component_id: z.string().nullable(),
  component_id: z.string().min(1, 'Component ID is required'),
  component_name: z.string().min(1, 'Component name is required'),
  component_type: z.string().min(1, 'Component type is required'),
  purchase_cost: z.number().min(0, 'Purchase cost must be positive'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  depreciation_method: z.string().min(1, 'Depreciation method is required'),
  depreciation_rate: z.number().min(0, 'Depreciation rate must be positive'),
  useful_life: z.number().min(0, 'Useful life must be positive'),
  salvage_value: z.number().min(0, 'Salvage value must be positive'),
  status: z.string().min(1, 'Status is required'),
  tenant_id: z.string().default(localStorage.getItem('tenantId')?.toString() || ''),
  createdAt: z.string().optional(),
})

export type Asset = z.infer<typeof assetSchema>
export type AssetComponent = z.infer<typeof assetComponentSchema>