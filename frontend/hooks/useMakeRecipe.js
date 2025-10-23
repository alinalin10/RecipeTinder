"use client"
import {useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useMakeRecipe = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(null);
    const {dispatch} = useAuthContext()

    const clearError = () => {
        setError(null)
    }

    const makerecipe = async (title, user, course, servings, description, prepTime, cookTime, calories, difficulty, steps, ingredients, image) => {
        console.log('Form values:', { title, user, course, servings, description, prepTime, cookTime, calories, difficulty, steps, ingredients, image })
        setIsLoading(true)
        setError(null)
        setSuccess(null)

        // API Call to backend
        const response = await fetch('http://localhost:4000/api/userrecipes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, user, course, servings, description, prepTime, cookTime, calories, difficulty, steps, ingredients, image})
        })

        const json = await response.json()

        //Response handling
        if (!response.ok) {
            console.log(json.error);
            setError(json.error)
        }

        if (response.ok) {   
            setError(null);
            console.log('Recipe Made');
            setSuccess('Recipe Made Successfully');

            //save the user to local storage
            localStorage.setItem('recipe', JSON.stringify(json))

            //update authcontext
        }
        setIsLoading(false)
    }

    return {makerecipe, isLoading, error, success, clearError}
}