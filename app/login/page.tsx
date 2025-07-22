'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import dayjs from 'dayjs'
import { useUserContext } from '@/context/UserContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setCompany } = useUserContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Step 1: Sign in
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError || !data?.user?.id) {
        console.error('🔴 Login error:', loginError)
        setError(loginError?.message || 'Invalid credentials. Please try again.')
        setLoading(false)
        return
      }

      const userId = data.user.id

      // Step 2: Fetch user profile
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('id, email, company_id, last_login')
        .eq('id', userId)
        .single()

      if (userError || !userProfile) {
        setError('User profile not found.')
        setLoading(false)
        return
      }

      // Step 3: Fetch company info
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, name, trial_start')
        .eq('id', userProfile.company_id)
        .single()

      if (companyError || !company) {
        setError('Company info not found.')
        setLoading(false)
        return
      }

      // Step 4: Check trial expiry
      const trialStart = dayjs(company.trial_start)
      const trialEnd = trialStart.add(30, 'day')
      const now = dayjs()

      if (now.isAfter(trialEnd)) {
        setError('Your 30-day free trial has expired. Please upgrade to continue.')
        setLoading(false)
        return
      }

      // Step 5: Update last login
      await supabase.from('users').update({ last_login: new Date() }).eq('id', userId)

      // Step 6: Set context
      setUser(userProfile)
      setCompany(company)

      // Step 7: Redirect
      router.push('/dashboard')
      return
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      // Avoid flash if redirect already happened
      if (!router) setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        {/* Logo + Brand */}
        <div className="mb-6 text-center">
          <Image
            src="/logo.png"
            alt="FlowGenie Logo"
            width={56}
            height={56}
            className="mx-auto mb-2"
          />
          <h1 className="text-3xl font-bold text-gray-800">FlowGenie</h1>
          <p className="text-sm text-gray-500 italic">Automate Smart. Approve Fast.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {loading && (
            <p className="text-xs text-gray-400 text-center">Logging you in, please wait...</p>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">
              {error}
              {error.includes('expired') && (
                <>
                  <br />
                  <a
                    href="/pricing"
                    className="text-blue-600 underline text-sm hover:text-blue-800"
                  >
                    Upgrade Now
                  </a>
                </>
              )}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FlowGenie. All rights reserved.{' '}
          <a
            href="https://yourcompany.com"
            className="text-blue-500 hover:underline"
            target="_blank"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  )
}
