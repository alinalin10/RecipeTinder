import { RecipesInfoContext } from '../context/RecipeInfoContext'
import { useContext } from 'react'

export const useRecipesInfoContext = () => {
    const context = useContext(RecipesInfoContext)

    if(!context) {
        throw Error('useRecipesInfoContext must be used inside a RecipesInfoContextProvider')
    }

    return context
}