"use client"
import React, { useState, useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { updateUserPreferences, getUserPreferences } from '../../utils/api'

const UserPref3 = () => {
    const { user } = useAuthContext()
    const cuisines = [
        "African", "American", "Asian", "British", "Cajun", "Caribbean",
        "Chinese", "Eastern European", "European", "French", "German",
        "Greek", "Indian", "Irish", "Italian", "Japanese", "Jewish",
        "Korean", "Latin American", "Mediterranean", "Mexican",
        "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
    ]

    const [selectedCuisine, setSelectedCuisine] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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
        if (loading) return
        setLoading(true)

        try {
            const newCuisines = selectedCuisine.includes(cuisine)
                ? selectedCuisine.filter(item => item !== cuisine)
                : [...selectedCuisine, cuisine]

            setSelectedCuisine(newCuisines)

            const cuisinePreferences = {
                cuisines: {
                    like: newCuisines
                }
            }

            await updateUserPreferences(user.userId, cuisinePreferences)
        } catch (error) {
            console.error('Failed to save preferences:', error)
            loadPreferences() // Reload from server on error
        } finally {
            setLoading(false)
        }
    }

    const clearAll = async () => {
        if (loading) return
        setLoading(true)

        try {
            setSelectedCuisine([])
            const cuisinePreferences = {
                cuisines: {
                    like: []
                }
            }
            await updateUserPreferences(user.userId, cuisinePreferences)
        } catch (error) {
            console.error('Failed to clear cuisines:', error)
            loadPreferences()
        } finally {
            setLoading(false)
        }
    }

    // Filter cuisines based on search term
    const filteredCuisines = cuisines.filter(cuisine =>
        cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className='max-w-4xl mx-auto mt-10'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h1 className='tracking-wide text-rose-500 font-semibold text-lg'>Cuisines</h1>
                    {selectedCuisine.length > 0 && (
                        <p className='text-sm text-gray-600 mt-1'>{selectedCuisine.length} cuisine{selectedCuisine.length > 1 ? 's' : ''} selected</p>
                    )}
                </div>
                <div className='flex items-center gap-3'>
                    {loading && <span className='text-sm text-amber-600 italic'>Saving...</span>}
                    {selectedCuisine.length > 0 && (
                        <button
                            onClick={clearAll}
                            disabled={loading}
                            className='text-sm text-rose-600 hover:text-rose-700 underline disabled:opacity-50'
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            <div className='bg-rose-50 rounded-xl p-6 space-y-4'>
                {/* Search box */}
                <div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search cuisines..."
                        className='w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500'
                    />
                </div>

                {/* Selected cuisines (shown at top) */}
                {selectedCuisine.length > 0 && (
                    <div>
                        <p className='text-xs text-gray-500 mb-2 font-medium'>Your selections:</p>
                        <div className='flex flex-wrap gap-2'>
                            {selectedCuisine.map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => toggleCuisine(cuisine)}
                                    disabled={loading}
                                    className='px-4 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white shadow-md hover:opacity-80 disabled:opacity-50 transition'
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                        <hr className='my-4 border-gray-300' />
                    </div>
                )}

                {/* All cuisines */}
                <div>
                    <p className='text-black font-medium mb-3'>
                        {searchTerm ? `Results (${filteredCuisines.length})` : 'All Cuisines'}
                    </p>
                    {filteredCuisines.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                            {filteredCuisines.map(cuisine => (
                                <button
                                    key={cuisine}
                                    onClick={() => toggleCuisine(cuisine)}
                                    disabled={loading}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-50 ${
                                        selectedCuisine.includes(cuisine)
                                            ? 'bg-rose-500 text-white shadow-md'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                    }`}
                                >
                                    {cuisine}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className='text-gray-500 text-sm italic'>No cuisines found matching "{searchTerm}"</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserPref3