import React from 'react'
import MakeRecipe from '../../components/MakeRecipe'
import ProtectedRoute from '@/app/components/ProtectedRoute'

const page = () => {
  return (
    <ProtectedRoute redirectTo="/signup">
      <div>
        <div className='bg-white'>
            <MakeRecipe />
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default page
