'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClientComponentClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return '?'
    const parts = email.split('@')[0].split('.')
    return parts.map((p) => p[0]?.toUpperCase()).join('').slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-16 bg-indigo-600 text-white shadow flex items-center justify-between px-4">
      {/* Left: Menu + Product Icon */}
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>

        {/* Product Icon or Logo */}
        <div className="text-lg font-bold text-white">
          {/* Replace below emoji with your SVG/logo if needed */}
          <span className="text-xl">📄</span> {/* Product Icon */}
        </div>
      </div>

      {/* Right: User Info + Dropdown */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-white hidden sm:block">
              {user.email}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-indigo-600 font-semibold p-0 hover:bg-slate-100"
                >
                  {getInitials(user.email)}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-32 bg-white text-slate-700 shadow-md border border-slate-200"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer hover:bg-slate-100"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  )
}
