'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import AuthHeader from '@/components/AuthHeader'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ✅ Step 1: Register user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // ✅ Step 2: Wait for session to be active (immediately or after email verification)
      let userId = signUpData?.user?.id

      if (!userId) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
        if (sessionError || !sessionData?.user) {
          setError('Check your email to verify and activate your account.')
          setLoading(false)
          return
        }
        userId = sessionData.user.id
      }

      // ✅ Step 3: Check if company exists
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, user_count, trial_start')
        .eq('company_id', companyId)
        .single()

      let companyIdToUse = null

      if (company && company.user_count >= 20) {
        setError(
          'This company has reached the 20-user limit in free trial. Please upgrade to continue.'
        )
        setLoading(false)
        return
      }

      // ✅ Step 4: Insert or update company (now session is active so RLS won't block)
      if (!company) {
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert({
            name: companyName,
            company_id: companyId,
            trial_start: new Date(),
            user_count: 1,
          })
          .select()
          .single()

        if (insertError) {
          setError('Failed to create company: ' + insertError.message)
          setLoading(false)
          return
        }

        companyIdToUse = newCompany.id
      } else {
        companyIdToUse = company.id

        await supabase
          .from('companies')
          .update({ user_count: company.user_count + 1 })
          .eq('id', company.id)
      }

      // ✅ Step 5: Insert user profile into `users` table
      const { error: insertUserError } = await supabase.from('users').insert({
        id: userId,
        email,
        company_id: companyIdToUse,
        last_login: new Date(),
      })

      if (insertUserError) {
        setError('User registered but failed to save profile: ' + insertUserError.message)
        setLoading(false)
        return
      }

      alert('Registration successful! Please check your email to verify your account.')
      router.push('/login')
    } catch (err) {
      console.error('Registration failed:', err)
      setError('Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <AuthHeader />
        <h2 className="text-xl font-semibold text-center mb-4">Create an Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="Unique Company ID (e.g., GSTIN)"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {error && (
            <p className="text-sm text-red-500 text-center mt-2">
              {error}
              {(error.includes('upgrade') || error.includes('limit')) && (
                <>
                  <br />
                  <a
                    href="/pricing"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    View Plans
                  </a>
                </>
              )}
            </p>
          )}
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  )
}
