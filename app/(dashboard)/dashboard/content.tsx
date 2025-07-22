'use client'

export default function DashboardContent() {
  return (
    <div className="w-full h-full p-6 md:p-10">
      <h2 className="text-3xl font-semibold text-slate-800 mb-4">
        Welcome to Your Dashboard 👋
      </h2>
      <p className="text-slate-700 text-base">
        You’re logged in and ready to go! Use the left menu to:
      </p>
      <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
        <li>Create and manage document types</li>
        <li>Set up approval workflows (simple or advanced)</li>
        <li>Submit and track documents</li>
        <li>View pending approvals</li>
        <li>Access reports and settings</li>
      </ul>

      <p className="mt-6 text-sm text-slate-500">
        Tip: Admins can customize document types, fields, and approval flows under “Settings”.
      </p>
    </div>
  )
}
