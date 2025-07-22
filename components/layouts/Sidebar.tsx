'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, FileText, User, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  userRole: 'admin' | 'user'
}

export default function Sidebar({ isOpen, userRole }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname.startsWith(path)

  return (
    <aside
      className={cn(
        'fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-md transition-all duration-300 z-40',
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      )}
    >
      <nav className="flex flex-col space-y-2 p-4 text-slate-700">
        {/* Approvals - always visible */}
        <Link
          href="/approvals"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-100 transition',
            isActive('/approvals') ? 'bg-indigo-100 font-medium' : ''
          )}
        >
          <CheckCircle size={20} />
          <span>Approvals</span>
        </Link>

        {/* Profile - always visible */}
        <Link
          href="/profile"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-100 transition',
            isActive('/profile') ? 'bg-indigo-100 font-medium' : ''
          )}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>

        {/* Settings - only for admin */}
        {userRole === 'admin' && (
          <div className="pt-4">
            <div className="text-xs font-semibold text-slate-500 px-3 pb-1 uppercase tracking-wide">
              Settings
            </div>
            <Link
              href="/settings/document-type"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-indigo-100 transition',
                isActive('/settings/document-type') ? 'bg-indigo-100 font-medium' : ''
              )}
            >
              <FileText size={20} />
              <span>Document Type</span>
            </Link>
          </div>
        )}
      </nav>
    </aside>
  )
}
