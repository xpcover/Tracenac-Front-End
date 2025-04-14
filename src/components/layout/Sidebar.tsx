import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { menuItems } from '@/lib/menu'
import { admintems } from '@/lib/adminMenu'
import { mockUser, hasAnyPermission } from '@/lib/auth'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    type UserRole = { userRole: string }
    const adminRole = user.roles?.find((role: UserRole) => role.userRole === 'admin')
    setIsAdmin(!!adminRole)
  }, [])

  // Filter menu items based on user permissions
  const visibleMenuItems = menuItems.filter(item => {
    // If no permissions required, show the item
    if (!item.requiredPermissions) return true
    // Otherwise, check if user has any of the required permissions
    return hasAnyPermission(mockUser, item.requiredPermissions)
  })

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const renderMenuItem = (item: typeof menuItems[0], isChild = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.includes(item.label)

    if (!hasChildren) {
      return (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              'hover:bg-gray-100',
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:text-gray-900',
              isChild && 'ml-6'
            )
          }
        >
          <item.icon size={20} />
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      )
    }

    return (
      <div key={item.to}>
        <button
          onClick={() => toggleMenu(item.label)}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors',
            'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
          )}
        >
          <div className="flex items-center gap-2">
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </div>
          {!collapsed && (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>
        {!collapsed && isExpanded && (
          <div className="mt-1">
            {item.children?.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-xl">Asset Manager</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {visibleMenuItems.map(item => (
            <li key={item.to}>
              {renderMenuItem(item)}
            </li>
          ))}
          {isAdmin && admintems.map(item => (
            <li key={item.to}>
              {renderMenuItem(item)}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}