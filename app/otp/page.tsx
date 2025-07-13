'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function OtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(30)
  const [message, setMessage] = useState('')
  const [country, setCountry] = useState('India (+91)')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  // Load mobile and country from sessionStorage
  useEffect(() => {
    const savedPhone = sessionStorage.getItem('phoneNumber')
    const savedCountry = sessionStorage.getItem('country')
    if (savedPhone) setPhoneNumber(savedPhone)
    if (savedCountry) setCountry(savedCountry)

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const confirmationResult = (window as any).confirmationResult as ConfirmationResult
      if (!confirmationResult) {
        setMessage('Session expired. Please login again.')
        setLoading(false)
        return
      }

      await confirmationResult.confirm(otp)
      router.push('/dashboard')
    } catch (error) {
      setMessage('Invalid OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setTimer(30)
    setMessage('')
    setOtp('')

    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      })

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha)
      ;(window as any).confirmationResult = confirmation
      setMessage('OTP resent successfully.')
    } catch (err) {
      console.error(err)
      setMessage('Failed to resend OTP. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Verify OTP</h1>
          <p className="text-sm text-gray-600 mt-1">OTP sent to:</p>
          <p className="text-lg font-semibold text-blue-700">{phoneNumber}</p>
          <p className="text-xs text-gray-500">{country}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center tracking-widest"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}

        <div className="mt-6 flex flex-col items-center gap-2">
          {timer === 0 ? (
            <button
              onClick={handleResend}
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-xs text-gray-500">Resend in {timer}s</p>
          )}

          <button
            onClick={() => router.push('/login')}
            className="text-sm text-gray-500 hover:text-blue-600 underline"
          >
            ← Back to Login
          </button>
        </div>

        <div id="recaptcha-container" />
      </div>
    </div>
  )
}
