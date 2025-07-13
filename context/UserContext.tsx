// /context/UserContext.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  id: string
  email: string
  company_id: string
  last_login?: string
}

type Company = {
  id: string
  name: string
  trial_start: string
}

type UserContextType = {
  user: User | null
  setUser: (user: User | null) => void
  company: Company | null
  setCompany: (company: Company | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser, company, setCompany }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}
