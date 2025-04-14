import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'
import { menuItems } from '@/lib/menu'
import Button from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { Role } from '@/lib/types'

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_TENANTS',
      'VIEW_SHORT_URLS',
      'VIEW_CREATE_REPORTS',
      'VIEW_REPORTS',
      'VIEW_MANAGE_ASSETS',
      'VIEW_BUSINESS_SETTINGS',
      'VIEW_SETTINGS',
      'VIEW_DOCUMENTATION',
    ],
  },
  {
    id: '2',
    name: 'Editor',
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_SHORT_URLS',
      'VIEW_CREATE_REPORTS',
      'VIEW_REPORTS',
      'VIEW_DOCUMENTATION',
    ],
  },
]

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')

  useEffect(() => {
    // Fetch roles from the API
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://api.tracenac.com/api/tenant/get-roles', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch roles')
        }

        const data = await response.json()
        setRoles(data.msg)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleName = e.target.value
    const role = roles.find(r => r.name === roleName) || null
    setSelectedRole(role)
  }

  const togglePermission = (permission: string) => {
    if (!selectedRole) return

    setSelectedRole(prevRole => {
      if (!prevRole) return null

      const updatedPermissions = prevRole.permissions.includes(permission)
        ? prevRole.permissions.filter(p => p !== permission)
        : [...prevRole.permissions, permission]

      return { ...prevRole, permissions: updatedPermissions }
    })
  }

  const handleAddRole = async () => {
    const newRole: Role = {
      tenantId: localStorage.getItem('tenantId'),
      name: newRoleName,
      permissions: [],
    }

    try {
      const response = await fetch('https://api.tracenac.com/api/client/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newRole),
      })

      if (!response.ok) {
        throw new Error('Failed to add role')
      }

      const data = await response.json()
      console.log('Role added successfully:', data)

      setRoles([...roles, newRole])
      setShowAddRoleModal(false)
      setNewRoleName('')
    } catch (error) {
      console.error('Error adding role:', error)
    }
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return

    try {
      const response = await fetch('https://api.tracenac.com/api/tenant/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(selectedRole),
      })

      if (!response.ok) {
        throw new Error('Failed to save permissions')
      }

      const data = await response.json()
      console.log('Permissions saved successfully:', data)
    } catch (error) {
      console.error('Error saving permissions:', error)
    }
  }

  const renderMenuItems = (items: typeof menuItems, parentLabel: string = '') => {
    return items.map(item => (
      <div key={item.label} className="flex flex-col">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
          <span>{parentLabel ? `${parentLabel} > ${item.label}` : item.label}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Enable</span>
              <Switch
                checked={item.requiredPermissions?.every(permission => selectedRole?.permissions.includes(permission)) || false}
                onChange={() => item.requiredPermissions?.forEach(permission => togglePermission(permission))}
                className={cn(
                  item.requiredPermissions?.every(permission => selectedRole?.permissions.includes(permission)) ? 'bg-blue-600' : 'bg-gray-200',
                  'relative inline-flex items-center h-6 rounded-full w-11'
                )}
              >
                <span className="sr-only">Enable</span>
                <span
                  className={cn(
                    item.requiredPermissions?.every(permission => selectedRole?.permissions.includes(permission)) ? 'translate-x-6' : 'translate-x-1',
                    'inline-block w-4 h-4 transform bg-white rounded-full'
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
        {item.children && (
          <div className="ml-4">
            {renderMenuItems(item.children, item.label)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Select Role</label>
        <select
          name="roles"
          value={selectedRole?.name || ''}
          onChange={handleRoleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <Button onClick={() => setShowAddRoleModal(true)} className="mt-4">
        Add Role
      </Button>

      {selectedRole && (
        <div>
          <h2 className="text-xl font-bold mb-2">Permissions for {selectedRole.name}</h2>
          <div className="space-y-4">
            {renderMenuItems(menuItems)}
          </div>
          <Button onClick={handleSavePermissions} className="mt-4">
            Save Permissions
          </Button>
        </div>
      )}

      {showAddRoleModal && (
        <Modal isOpen={showAddRoleModal} onClose={() => setShowAddRoleModal(false)} title="Add Role">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <Input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="mt-1"
            />
            <Button onClick={handleAddRole} className="mt-4">
              Add Role
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}