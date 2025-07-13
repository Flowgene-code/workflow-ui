// components/RegisterPage.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyId, setCompanyId] = useState('') // e.g. GSTIN
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Check if company exists
      const { data: existingCompany, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', companyId)
        .single()

      let company

      if (!existingCompany) {
        // 2. Create company if doesn't exist
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert([
            {
              company_id: companyId,
              name: companyName,
              trial_started_at: new Date().toISOString()
            }
          ])
          .select()
          .single()

        if (insertError) throw insertError
        company = newCompany
      } else {
        company = existingCompany
      }

      // 3. Count existing users
      const { count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)

      if ((count ?? 0) >= 20) {
        throw new Error('Free trial user limit (20) reached for this company.')
      }

      // 4. Sign up user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) throw signUpError

      // 5. Insert user metadata
      const userId = signUpData.user?.id
      if (userId) {
        await supabase.from('users').insert([
          {
            id: userId,
            email,
            name,
            company_id: companyId
          }
        ])
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="FlowGenie Logo" className="h-14 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />

          <input
            type="text"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            placeholder="Company Identifier (e.g. GSTIN)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
