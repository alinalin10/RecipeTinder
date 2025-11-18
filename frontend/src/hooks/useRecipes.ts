"use client"
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

// Define the shape of a recipe from Spoonacular API
export interface Recipe {
    id: number;
    title: string;
    image?: string;
    readyInMinutes?: number;
    servings?: number;
    summary?: string;
    sourceName?: string;
    sourceUrl?: string;
    spoonacularScore?: number;

    // Extended fields for full recipe details
    extendedIngredients?: Array<{
        id: number;
        original: string;
        name: string;
        amount: number;
        unit: string;
    }>;
    analyzedInstructions?: Array<{
        name: string;
        steps: Array<{
            number: number;
            step: string;
        }>;
    }>;
    preparationMinutes?: number;
    cookingMinutes?: number;
    cuisines?: string[];
    nutrition?: {
        nutrients: Array<{
            name: string;
            amount: number;
            unit: string;
        }>;
        caloricBreakdown?: {
            percentProtein: number;
            percentFat: number;
            percentCarbs: number;
        };
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Allow additional properties
}

// Define the return type of the useRecipes hook
interface UseRecipesReturn {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    clearError: () => void;
    getRandomRecipes: (number?: number, tags?: string) => Promise<void>;
    searchRecipes: (query: string, cuisine?: string, diet?: string, intolerances?: string, excludeIngredients?: string, number?: number) => Promise<void>;
    getRecipeById: (id: string | number) => Promise<Recipe | null>;
    getSimilarRecipes: (id: string | number, number?: number) => Promise<void>;
    findByIngredients: (ingredients: string, number?: number) => Promise<void>;
}

export const useRecipes = (): UseRecipesReturn => {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuthContext()

    const clearError = (): void => {
        setError(null)
    }

    // Get random recipes (personalized if user is logged in)
    const getRandomRecipes = async (number: number = 10, tags: string = ''): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                number: number.toString(),
                ...(tags && { tags })
            })

            // Include auth token if user is logged in for personalized recommendations
            const headers: HeadersInit = {}
            if (user?.token) {
                headers['Authorization'] = `Bearer ${user.token}`
            }

            const response = await fetch(
                `http://localhost:4000/api/recipes/random?${params}`,
                { headers }
            )
            const json = await response.json()

            setLoading(false)

            if (!response.ok) {
                console.log('Error:', json.error)
                setError(json.error || 'Failed to fetch recipes')
                setRecipes([])
            } else {
                console.log('Random recipes fetched:', json.data.length)
                setRecipes(json.data)
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('Network error: ' + (err as Error).message)
            setRecipes([])
            setLoading(false)
        }
    }

    // Search recipes
    const searchRecipes = async (
        query: string,
        cuisine: string = '',
        diet: string = '',
        intolerances: string = '',
        excludeIngredients: string = '',
        number: number = 10
    ): Promise<void> => {
        setLoading(true)
        setError(null)

        if (!query) {
            setError('Search query is required')
            setLoading(false)
            return
        }

        try {
            const params = new URLSearchParams({
                query,
                number: number.toString(),
                ...(cuisine && { cuisine }),
                ...(diet && { diet }),
                ...(intolerances && { intolerances }),
                ...(excludeIngredients && { excludeIngredients })
            })

            const response = await fetch(
                `http://localhost:4000/api/recipes/search?${params}`
            )
            const json = await response.json()

            setLoading(false)

            if (!response.ok) {
                console.log('Error:', json.error)
                setError(json.error || 'Failed to search recipes')
                setRecipes([])
            } else {
                console.log('Search results:', json.data.length)
                setRecipes(json.data)
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('Network error: ' + (err as Error).message)
            setRecipes([])
            setLoading(false)
        }
    }

    // Get recipe by ID
    const getRecipeById = async (id: string | number): Promise<Recipe | null> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `http://localhost:4000/api/recipes/${id}`
            )
            const json = await response.json()

            setLoading(false)

            if (!response.ok) {
                console.log('Error:', json.error)
                setError(json.error || 'Failed to fetch recipe details')
                return null
            } else {
                console.log('Recipe details fetched:', json.data.title)
                return json.data
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('Network error: ' + (err as Error).message)
            setLoading(false)
            return null
        }
    }

    // Get similar recipes
    const getSimilarRecipes = async (id: string | number, number: number = 5): Promise<void> => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(
                `http://localhost:4000/api/recipes/${id}/similar?number=${number}`
            )
            const json = await response.json()

            setLoading(false)

            if (!response.ok) {
                console.log('Error:', json.error)
                setError(json.error || 'Failed to fetch similar recipes')
                setRecipes([])
            } else {
                console.log('Similar recipes fetched:', json.data.length)
                setRecipes(json.data)
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('Network error: ' + (err as Error).message)
            setRecipes([])
            setLoading(false)
        }
    }

    // Find recipes by ingredients
    const findByIngredients = async (ingredients: string, number: number = 10): Promise<void> => {
        setLoading(true)
        setError(null)

        if (!ingredients) {
            setError('Ingredients are required')
            setLoading(false)
            return
        }

        try {
            const params = new URLSearchParams({
                ingredients,
                number: number.toString()
            })

            const response = await fetch(
                `http://localhost:4000/api/recipes/ingredients/find?${params}`
            )
            const json = await response.json()

            setLoading(false)

            if (!response.ok) {
                console.log('Error:', json.error)
                setError(json.error || 'Failed to find recipes by ingredients')
                setRecipes([])
            } else {
                console.log('Recipes by ingredients found:', json.data.length)
                setRecipes(json.data)
            }
        } catch (err) {
            console.error('Network error:', err)
            setError('Network error: ' + (err as Error).message)
            setRecipes([])
            setLoading(false)
        }
    }

    return {
        recipes,
        loading,
        error,
        clearError,
        getRandomRecipes,
        searchRecipes,
        getRecipeById,
        getSimilarRecipes,
        findByIngredients
    }
}
