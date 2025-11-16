'use client';

import { SavedRecipesContext } from '../context/SavedRecipeContext'
import { useContext } from 'react'

export const useSavedRecipesContext = () => {
    const context = useContext(SavedRecipesContext)

    if(!context) {
        throw Error('useSavedRecipesContext must be used inside a SavedRecipesContextProvider')
    }

    return context
}