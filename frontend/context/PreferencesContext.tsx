"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { getUserPreferences, updateUserPreferences } from '../src/utils/api'

interface DietaryPreferences {
  diets: string[]
  excludeIngredients: string[]
}

interface CuisinePreferences {
  like: string[]
  dislike: string[]
}

interface UserPreferences {
  dietary: DietaryPreferences
  cuisines: CuisinePreferences
}

interface PreferencesContextType {
  preferences: UserPreferences
  updateDietaryPreferences: (dietary: DietaryPreferences) => Promise<void>
  updateCuisinePreferences: (cuisines: CuisinePreferences) => Promise<void>
  loading: boolean
  error: string | null
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined)

interface PreferencesProviderProps {
  children: ReactNode
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  const { user } = useAuthContext()
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietary: { diets: [], excludeIngredients: [] },
    cuisines: { like: [], dislike: [] }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.userId) {
      loadPreferences()
    }
  }, [user])

  const loadPreferences = async () => {
    setLoading(true)
    setError(null)
    try {
      const userPrefs = await getUserPreferences(user.userId)
      setPreferences({
        dietary: userPrefs.dietary || { diets: [], excludeIngredients: [] },
        cuisines: userPrefs.cuisines || { like: [], dislike: [] }
      })
    } catch (err) {
      setError('Failed to load preferences')
      console.error('Failed to load preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateDietaryPreferences = async (dietary: DietaryPreferences) => {
    if (!user?.userId) return

    setLoading(true)
    setError(null)
    try {
      await updateUserPreferences(user.userId, { dietary })
      setPreferences(prev => ({ ...prev, dietary }))
    } catch (err) {
      setError('Failed to save dietary preferences')
      console.error('Failed to save dietary preferences:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCuisinePreferences = async (cuisines: CuisinePreferences) => {
    if (!user?.userId) return

    setLoading(true)
    setError(null)
    try {
      await updateUserPreferences(user.userId, { cuisines })
      setPreferences(prev => ({ ...prev, cuisines }))
    } catch (err) {
      setError('Failed to save cuisine preferences')
      console.error('Failed to save cuisine preferences:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <PreferencesContext.Provider value={{
      preferences,
      updateDietaryPreferences,
      updateCuisinePreferences,
      loading,
      error
    }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = () => {
  const context = useContext(PreferencesContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}