import React from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import UserPref from '@/app/components/UserPref'
import UserPref2 from '@/app/components/UserPref2'
import UserPref3 from '@/app/components/UserPref3'

const page = () => {
  return (
    <ProtectedRoute>
      <div className='bg-white'>
          <UserPref />
          <UserPref2 />
          <UserPref3 />
      </div>
    </ProtectedRoute>
  )
}

export default page
