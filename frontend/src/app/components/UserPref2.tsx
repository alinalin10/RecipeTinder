"use client"
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { updateUserPreferences, getUserPreferences } from '../../utils/api'

const UserPref2 = () => {
    const { user } = useAuthContext()
    const dietOptions = ["Vegan", "Vegetarian", "Lacto-Vegetarian", "Ovo-Vegetarian", "Pescatarian", "Paleo", "Primal", "Ketogenic", "Gluten Free", "Low FODMAP", "Whole30"]
    const excludedOptions = [
        "Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"
    ]
    const allergyOptions = [
        "Dairy", "Egg", "Gluten", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Tree Nut", "Wheat"
    ]

    const [selectedDiet, setSelectedDiet] = useState<string[]>([])
    const [selectExclude, setSelectExcluded] = useState<string[]>([])
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [customExclude, setCustomExclude] = useState('')

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
                setSelectedAllergies(preferences.dietary.allergies || [])
            }
        } catch (error) {
            console.error('Failed to load preferences:', error)
        }
    }

    const savePreferences = async (newDiet: string[], newExclude: string[], newAllergies: string[]) => {
        const dietaryPreferences = {
            dietary: {
                diets: newDiet,
                excludeIngredients: newExclude,
                allergies: newAllergies
            }
        }
        await updateUserPreferences(user.userId, dietaryPreferences)
    }

    const toggleOption = async (option: string, type: 'diet' | 'exclude' | 'allergy') => {
        if (loading) return
        setLoading(true)

        try {
            let newDiet = [...selectedDiet]
            let newExclude = [...selectExclude]
            let newAllergies = [...selectedAllergies]

            if (type === 'diet') {
                newDiet = selectedDiet.includes(option)
                    ? selectedDiet.filter(item => item !== option)
                    : [...selectedDiet, option]
                setSelectedDiet(newDiet)
            } else if (type === 'exclude') {
                newExclude = selectExclude.includes(option)
                    ? selectExclude.filter(item => item !== option)
                    : [...selectExclude, option]
                setSelectExcluded(newExclude)
            } else if (type === 'allergy') {
                newAllergies = selectedAllergies.includes(option)
                    ? selectedAllergies.filter(item => item !== option)
                    : [...selectedAllergies, option]
                setSelectedAllergies(newAllergies)
            }

            await savePreferences(newDiet, newExclude, newAllergies)
        } catch (error) {
            console.error('Failed to save preferences:', error)
            loadPreferences() // Reload from server on error
        } finally {
            setLoading(false)
        }
    }

    const addCustomExclude = async () => {
        if (!customExclude.trim() || loading) return

        const trimmed = customExclude.trim()
        if (selectExclude.includes(trimmed)) {
            setCustomExclude('')
            return
        }

        setLoading(true)
        try {
            const newExclude = [...selectExclude, trimmed]
            setSelectExcluded(newExclude)
            setCustomExclude('')
            await savePreferences(selectedDiet, newExclude, selectedAllergies)
        } catch (error) {
            console.error('Failed to add custom ingredient:', error)
            loadPreferences()
        } finally {
            setLoading(false)
        }
    }

    const clearAll = async (type: 'diet' | 'exclude' | 'allergy') => {
        if (loading) return
        setLoading(true)

        try {
            let newDiet = selectedDiet
            let newExclude = selectExclude
            let newAllergies = selectedAllergies

            if (type === 'diet') {
                newDiet = []
                setSelectedDiet([])
            } else if (type === 'exclude') {
                newExclude = []
                setSelectExcluded([])
            } else if (type === 'allergy') {
                newAllergies = []
                setSelectedAllergies([])
            }

            await savePreferences(newDiet, newExclude, newAllergies)
        } catch (error) {
            console.error('Failed to clear:', error)
            loadPreferences()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='max-w-4xl mx-auto mt-10'>
            <hr className='border-t border-gray-300 my-4'/>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-gray-400 text-lg font-medium'>Recipe Preferences</h1>
                {loading && <span className='text-sm text-amber-600 italic'>Saving...</span>}
            </div>

            <div className='bg-rose-50 rounded-xl p-6 space-y-6'>
                {/* Diet Section */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <p className='text-black font-semibold text-base'>Dietary Preferences</p>
                            {selectedDiet.length > 0 && (
                                <p className='text-sm text-gray-600'>{selectedDiet.length} selected</p>
                            )}
                        </div>
                        {selectedDiet.length > 0 && (
                            <button
                                onClick={() => clearAll('diet')}
                                disabled={loading}
                                className='text-xs text-rose-600 hover:text-rose-700 underline disabled:opacity-50'
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {dietOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => toggleOption(option, 'diet')}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectedDiet.includes(option)
                                        ? 'bg-rose-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Allergies Section */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <p className='text-black font-semibold text-base'>Allergies</p>
                            <p className='text-xs text-gray-500'>Recipes with these will be completely excluded</p>
                            {selectedAllergies.length > 0 && (
                                <p className='text-sm text-gray-600 mt-1'>{selectedAllergies.length} selected</p>
                            )}
                        </div>
                        {selectedAllergies.length > 0 && (
                            <button
                                onClick={() => clearAll('allergy')}
                                disabled={loading}
                                className='text-xs text-rose-600 hover:text-rose-700 underline disabled:opacity-50'
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {allergyOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => toggleOption(option, 'allergy')}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectedAllergies.includes(option)
                                        ? 'bg-red-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Excluded Ingredients Section */}
                <div>
                    <div className='flex items-center justify-between mb-3'>
                        <div>
                            <p className='text-black font-semibold text-base'>Excluded Ingredients</p>
                            <p className='text-xs text-gray-500'>Foods you prefer to avoid</p>
                            {selectExclude.length > 0 && (
                                <p className='text-sm text-gray-600 mt-1'>{selectExclude.length} selected</p>
                            )}
                        </div>
                        {selectExclude.length > 0 && (
                            <button
                                onClick={() => clearAll('exclude')}
                                disabled={loading}
                                className='text-xs text-rose-600 hover:text-rose-700 underline disabled:opacity-50'
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                    <div className='flex flex-wrap gap-2 mb-3'>
                        {excludedOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => toggleOption(option, 'exclude')}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                    selectExclude.includes(option)
                                        ? 'bg-orange-500 text-white shadow-md'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Custom excluded ingredients */}
                    {selectExclude.filter(item => !excludedOptions.includes(item)).length > 0 && (
                        <div className='mb-3'>
                            <p className='text-xs text-gray-500 mb-2'>Custom ingredients:</p>
                            <div className='flex flex-wrap gap-2'>
                                {selectExclude.filter(item => !excludedOptions.includes(item)).map(item => (
                                    <button
                                        key={item}
                                        onClick={() => toggleOption(item, 'exclude')}
                                        disabled={loading}
                                        className='px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white shadow-md hover:opacity-80 disabled:opacity-50'
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add custom ingredient */}
                    <div className='flex gap-2'>
                        <input
                            type="text"
                            value={customExclude}
                            onChange={(e) => setCustomExclude(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomExclude()}
                            placeholder="Add custom ingredient to exclude..."
                            disabled={loading}
                            className='flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 disabled:bg-gray-100'
                        />
                        <button
                            onClick={addCustomExclude}
                            disabled={loading || !customExclude.trim()}
                            className='px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition'
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPref2