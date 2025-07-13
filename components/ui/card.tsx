import React from 'react'
import clsx from 'clsx'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("bg-white shadow-md rounded-xl border border-gray-200", className)}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  )
}
