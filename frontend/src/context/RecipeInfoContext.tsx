'use client';
import { createContext, useState, useReducer, useEffect, ReactNode } from 'react'

export const RecipesInfoContext = createContext(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const recipesReducer = (state: { recipes: any[] }, action: { type: string; payload: any }) => {
    switch (action.type) {
        case 'SET_RECIPES':
            return {
                recipes: action.payload
            }
        case 'CREATE_RECIPE':
            return {
                recipes: [action.payload, ...state.recipes]
            }
        default:
            return state

    }
}

export const RecipesInfoContextProvider = ( { children }: { children: ReactNode } ) => {
    const [state, dispatch] = useReducer(recipesReducer, {
        recipes: []
    })

    // for when the backend database is setup - can changle recipes: exampleRecipes to recipes: null as well in the line above and delete example data

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // if this is deployed, this will need to change
                const response = await fetch('http://localhost:4000/api/userrecipes');
                if (!response.ok) {
                    const text = await response.text();
                    console.error("Failed to fetch recipes:", response.status, text);
                    return;
                }
                const json = await response.json();
                dispatch({ type: 'SET_RECIPES', payload: json });
            } catch (error) {
                console.error("Error fetching recipe:", error);
            }
        };

        fetchRecipes();
    }, []);


    return (
        <RecipesInfoContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RecipesInfoContext.Provider>
    )
}