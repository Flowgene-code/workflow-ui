'use client'

import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Pricing Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Free Plan */}
        <div className="border rounded-2xl p-6 shadow-sm text-center">
          <h2 className="text-xl font-semibold mb-2">Free Trial</h2>
          <p className="text-gray-600 mb-4">Up to 20 users, 30 days</p>
          <p className="text-3xl font-bold mb-4">₹0</p>
          <p className="text-sm text-gray-500">No credit card required</p>
        </div>

        {/* Paid Plan */}
        <div className="border rounded-2xl p-6 shadow-md text-center bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">Business Plan</h2>
          <p className="text-gray-600 mb-4">Unlimited users, premium support</p>
          <p className="text-3xl font-bold mb-4">₹999/month</p>
          <button
            onClick={() => router.push('/subscribe')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Subscribe Now
          </button>
        </div>

        <div className="mt-10 text-center">
  <p className="text-sm text-gray-500">
    Not ready to upgrade?{' '}
    <a href="/login" className="text-blue-600 underline hover:text-blue-800">
      Go back to Login
    </a>
  </p>
</div>


      </div>
    </div>
  )
}
