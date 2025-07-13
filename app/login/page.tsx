'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import dayjs from 'dayjs'
import { useUserContext } from '@/context/UserContext' // ✅ Add context

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setCompany } = useUserContext() // ✅ Context setters

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
        password
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
      await supabase
        .from('users')
        .update({ last_login: new Date() })
        .eq('id', userId)

      // ✅ Step 6: Set context
      setUser(userProfile)
      setCompany(company)

      // ✅ Step 7: Redirect early to prevent flicker
      router.push('/dashboard')
      return // 🛑 Stop execution to skip finally block
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      // ❌ Avoid setting loading = false after redirect to prevent flash
      if (!router) setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="FlowGenie Logo" className="h-14 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">FlowGenie</h1>
          <p className="text-sm text-gray-500 italic">Automate Smart. Approve Fast.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

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

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  )
}
