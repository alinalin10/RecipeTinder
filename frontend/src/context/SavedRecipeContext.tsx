'use client';

import { createContext, useState, useReducer, useEffect, ReactNode } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext';

export const SavedRecipesContext = createContext(null)

export const savedRecipesReducer = (state: { savedRecipes: any[] }, action: { type: string; payload: any }) => {
    switch (action.type) {
        case 'SET_RECIPES':
            return {
                savedRecipes: action.payload
            }
        case 'CREATE_RECIPE':
            return {
                savedRecipes: [action.payload, ...state.savedRecipes]
            }
        default:
            return state

    }
}

export const SavedRecipesContextProvider = ( { children }: { children: ReactNode } ) => {
    const { user } = useAuthContext();
    const userId = user?.token;

    const [state, dispatch] = useReducer(savedRecipesReducer, {
        savedRecipes: []
    })

    // for when the backend database is setup - can changle recipes: exampleRecipes to recipes: null as well in the line above and delete example data

    useEffect(() => {
        if (!userId) return;

        const fetchSavedRecipes = async () => {
            try {
                // if this is deployed, this will need to change

                const response = await fetch(`http://localhost:4000/api/users/${userId}/savedRecipes`);

                if (!response.ok) {
                    const text = await response.text();
                    console.error("Failed to fetch saved recipes:", response.status, text);
                    return;
                }
                const json = await response.json();
                dispatch({ type: 'SET_RECIPES', payload: json.savedRecipes });
            } catch (error) {
                console.error("Error fetching saved recipe:", error);
            }
        };

        fetchSavedRecipes();
    }, []);


    return (
        <SavedRecipesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SavedRecipesContext.Provider>
    )
}