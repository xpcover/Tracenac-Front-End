import { Layout, User, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

export function TopBar() {
  return (
    <div className="h-16 px-4 border-b bg-white flex items-center justify-end gap-4">
      <Link
        to="/setup"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Setup"
      >
        <Layout className="w-5 h-5" />
      </Link>
      <Link
        to="/notifications"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </Link>
      <Link
        to="/profile"
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Profile"
      >
        <User className="w-5 h-5" />
      </Link>
    </div>
  )
}