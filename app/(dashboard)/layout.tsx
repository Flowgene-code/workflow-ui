'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layouts/Header'
import Sidebar from '@/components/layouts/Sidebar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState('user')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchRole() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userData?.role === 'admin') {
          setUserRole('admin')
        }
      }
    }

    fetchRole()
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} userRole={userRole} />
        <main
          className={`transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          } w-full p-4`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
