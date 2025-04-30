import { AuthUser } from './types'

// Mock user data - in a real app, this would come from your authentication system
export const mockUser: AuthUser = {
  user_id: '1',
  username: 'admin',
  roles: [
    {
      role_id: '1',
      role_name: 'Admin',
      permissions: [
        'VIEW_DASHBOARD',
        'SHORT_URLS',
        'VIEW_CREATE_REPORTS',
        'VIEW_REPORTS',
        'VIEW_MANAGE_ASSETS',
        'VIEW_BUSINESS_SETTINGS',
        'VIEW_SETTINGS',
        'VIEW_DOCUMENTATION',
        'VIEW_TENANTS',
        'VIEW_USERS',
        'VIEW_ROLES',
        'VIEW_PERMISSIONS',
        'VIEW_ASSET_CATEGORIES',
        'VIEW_ASSET_BLOCKS',
        'VIEW_DEPARTMENTS',
        'VIEW_LOCATIONS',
        'VIEW_COST_CENTRES',
        'VIEW_ASSETS',
        'VIEW_ASSET_COMPONENTS',
        'VIEW_DEPRECIATION',
        'VIEW_ASSET_HISTORY',
        'VIEW_CONTRACTS',
        'VIEW_BUDGETS',
        'VIEW_FOREX',
        'VIEW_NOTIFICATIONS',
        'VIEW_SHIFT_USAGE',
        'VIEW_REPORTS',
        'VIEW_REPORT_PERMISSIONS',
        'VIEW_ASSET_LABELS',
        'VIEW_BARCODE_SCANS',
        'VIEW_IMPAIRMENT',
        'VIEW_LEASES',
        'VIEW_WIP_ASSETS',
      ],
    },
  ],
}

export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.roles.some(role => role.permissions.includes(permission))
}

export function hasAnyPermission(user: AuthUser, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(user, permission))
}