'use client'

import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white 
        rounded-lg 
        shadow 
        p-6 
        ${className}
      `}
    >
      {children}
    </div>
  )
}
