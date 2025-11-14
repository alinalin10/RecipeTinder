"use client"
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { updateUserPreferences, getUserPreferences } from '../../utils/api'

const UserPref3 = () => {
    const { user } = useAuthContext()
    const cuisines = [  
        "African", "Asian", "American", "British", "Cajun", "Caribbean",
        "Chinese", "Eastern European", "European", "French", "German",
        "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish",
        "Korean", "Latin American", "Mediterranean", "Mexican",
        "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"];

    const [selectedCuisine, setSelectedCuisine] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // Load existing preferences on component mount
    useEffect(() => {
        if (user?.userId) {
            loadPreferences()
        }
    }, [user])

    const loadPreferences = async () => {
        try {
            const preferences = await getUserPreferences(user.userId)
            if (preferences.cuisines) {
                setSelectedCuisine(preferences.cuisines.like || [])
            }
        } catch (error) {
            console.error('Failed to load preferences:', error)
        }
    }

    const toggleCuisine = async (cuisine: string) => {
        if (loading) return // Prevent clicks during save
        
        setLoading(true)
        
        try {
            let newCuisines: string[]
            
            if (selectedCuisine.includes(cuisine)) {
                newCuisines = selectedCuisine.filter(item => item !== cuisine)
            } else {
                newCuisines = [...selectedCuisine, cuisine]
            }
            
            setSelectedCuisine(newCuisines)

            // Auto-save the changes
            const cuisinePreferences = {
                cuisines: {
                    like: newCuisines
                }
            }

            await updateUserPreferences(user.userId, cuisinePreferences)
        } catch (error) {
            console.error('Failed to save preferences:', error)
            // Revert the change on error
            setSelectedCuisine(selectedCuisine)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl mx-auto mt-10'>
            <div className='flex items-center justify-between mb-2'>
                <h1 className='tracking-wide text-rose-500'>Cuisines</h1>
                {loading && <span className='text-sm text-amber-600 italic'>Saving...</span>}
            </div>
            
            <div className='bg-rose-50 rounded-xl p-6 space-y-4'>
                <div>
                    <p className='text-black mb-2'>Cuisine Choices</p>
                    <div className='flex flex-wrap gap-2'>
                        {cuisines.map(cuisine => (
                            <button 
                                key={cuisine} 
                                onClick={() => toggleCuisine(cuisine)}
                                disabled={loading}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectedCuisine.includes(cuisine)
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPref3