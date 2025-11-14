// Security wrapper component that protects pages from unauthorized access
// Ensures only logged-in users can access certain pages and redirects to login page if not
'use client'
import React, { useEffect, ReactNode } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push(redirectTo)
    }
  }, [user, router, redirectTo])

  // Show loading while checking auth
  if (!user) {
    return (
      <div className='bg-white min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4'></div>
          <p className='text-lg text-gray-600'>Please log in to access this page.</p>
          <p className='text-sm text-gray-400 mt-2'>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute