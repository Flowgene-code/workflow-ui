'use client'

import { useUserContext } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const { user, company } = useUserContext()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-800">Welcome, {user.email}</h1>
            <p className="text-sm text-gray-500">
              Company: <span className="font-medium text-gray-700">{company.name}</span>
            </p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Workflows Card */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">Pending Workflows</h2>
              <Link href="/workflows/new">
                <Button>Create Workflow</Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              You currently have 0 workflows pending your approval.
            </p>
          </CardContent>
        </Card>

        {/* Future: Table or tabs can go here */}
      </div>
    </div>
  )
}
