"use client"
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../../hooks/useAuthContext'
import { updateUserPreferences, getUserPreferences } from '../../utils/api'

const UserPref2 = () => {
    const { user } = useAuthContext()
    const dietOptions = ["Vegan", "Glutenfree", "Ketogenic", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Pescatarian", "Paleo", "Primal", "Low FODMAP", "Whole30"]
    const excludedOptions = ["Nuts", "Oil", "Milk"]

    const [selectedDiet, setSelectedDiet] = useState<string[]>([])
    const [selectExclude, setSelectExcluded] = useState<string[]>([])
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
            if (preferences.dietary) {
                setSelectedDiet(preferences.dietary.diets || [])
                setSelectExcluded(preferences.dietary.excludeIngredients || [])
            }
        } catch (error) {
            console.error('Failed to load preferences:', error)
        }
    }

    const toggleOption = async (option: string, type: 'diet' | 'exclude') => {
        if (loading) return // Prevent clicks during save
        
        setLoading(true)
        
        try {
            let newDiet = [...selectedDiet]
            let newExclude = [...selectExclude]
            
            if (type === 'diet') {
                if (selectedDiet.includes(option)) {
                    newDiet = selectedDiet.filter(item => item !== option)
                } else {
                    newDiet = [...selectedDiet, option]
                }
                setSelectedDiet(newDiet)
            } else {
                if (selectExclude.includes(option)) {
                    newExclude = selectExclude.filter(item => item !== option)
                } else {
                    newExclude = [...selectExclude, option]
                }
                setSelectExcluded(newExclude)
            }

            // Auto-save the changes
            const dietaryPreferences = {
                dietary: {
                    diets: newDiet,
                    excludeIngredients: newExclude
                }
            }

            await updateUserPreferences(user.userId, dietaryPreferences)
        } catch (error) {
            console.error('Failed to save preferences:', error)
            // Revert the change on error
            if (type === 'diet') {
                setSelectedDiet(selectedDiet)
            } else {
                setSelectExcluded(selectExclude)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl mx-auto mt-10'>
            <hr className='border-t border-gray-300 my-4'/>
            <h1 className='text-gray-400 text-lg font-medium mb-6 flex items-center justify-center'>Recipe Preferences</h1>
            
            <div className='flex items-center justify-between mb-2'>
                <h1 className='tracking-wide text-rose-500'>Dietary Conditions</h1>
                {loading && <span className='text-sm text-amber-600 italic'>Saving...</span>}
            </div>
            
            <div className='bg-rose-50 rounded-xl p-6 space-y-4'>
                <div>
                    <p className='text-black mb-2'>Diet</p>
                    <div className='flex flex-wrap gap-2'>
                        {dietOptions.map(option => (
                            <button 
                                key={option} 
                                onClick={() => toggleOption(option, 'diet')}
                                disabled={loading}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectedDiet.includes(option)
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <p className='mb-2'>Excluded Ingredients</p>
                    <div className='flex flex-wrap gap-2'>
                        {excludedOptions.map(option => (
                            <button 
                                key={option} 
                                onClick={() => toggleOption(option, 'exclude')}
                                disabled={loading}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectExclude.includes(option)
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPref2