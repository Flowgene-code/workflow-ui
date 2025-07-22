'use client'

import React from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded 
        font-medium 
        transition duration-200 ease-in-out
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed text-white' 
          : 'bg-primary hover:bg-primary-hover text-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}
