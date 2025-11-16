'use client';

import { createContext, useState, useReducer, useEffect, ReactNode } from 'react'
import { useAuthContext } from '@/hooks/useAuthContext';

export interface SavedRecipe {
  _id: string;
  recipeId: string | number;
  UserId: string;
  recipeTitle: string;
  recipeType: string;
  action: string;
  savedAt: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

interface SavedRecipesContextType {
  savedRecipes: SavedRecipe[];
  dispatch: React.Dispatch<any>;
}

export const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(undefined);

export const savedRecipesReducer = (state: { savedRecipes: SavedRecipe[] }, action: { type: string; payload: SavedRecipe[] }) => {
  switch (action.type) {
    case 'SET_RECIPES':
      return { savedRecipes: action.payload };
    case 'CREATE_RECIPE':
      return { savedRecipes: [action.payload, ...state.savedRecipes] };
    default:
      return state;
  }
};


export const SavedRecipesContextProvider = ( { children }: { children: ReactNode } ) => {
    console.log('[SavedRecipesContextProvider] MOUNTED');
    const { user } = useAuthContext();
    const userId = user?.userId;

    const [state, dispatch] = useReducer(savedRecipesReducer, {
        savedRecipes: []
    })

    console.log('[DEBUG] Auth user:', user);
    console.log('[DEBUG] User ID:', userId);
    console.log('[DEBUG] Initial saved recipes state:', state.savedRecipes);


    // for when the backend database is setup - can changle recipes: exampleRecipes to recipes: null as well in the line above and delete example data

    useEffect(() => {
        console.log('[DEBUG] useEffect triggered. userId =', userId);

        if (!userId) {
            console.log('[DEBUG] No userId yet. Exiting effect.');
            return;
        }

        const fetchSavedRecipes = async () => {
            try {
                // if this is deployed, this will need to change
                console.log('[DEBUG] Fetching saved recipes for userId:', userId);

                const response = await fetch(`http://localhost:4000/api/user/${userId}/savedRecipes`);

                if (!response.ok) {
                    const text = await response.text();
                    console.error('[DEBUG] Fetch failed:', response.status, text);
                    console.error("Failed to fetch saved recipes:", response.status, text);
                    return;
                }
                const json = await response.json();
                console.log('[DEBUG] Raw fetch response JSON:', json);
                console.log("Dispatching saved recipes:", json.savedRecipes);
                const payload = json.savedRecipes ?? json.recipes ?? [];
                console.log('[DEBUG] Payload for dispatch:', payload);
                dispatch({ type: 'SET_RECIPES', payload/*: json.savedRecipes*/ });
            } catch (error) {
                console.error("Error fetching saved recipe:", error);
            }
        };

        fetchSavedRecipes();
    }, [userId]);

    useEffect(() => {
        console.log('[DEBUG] Saved recipes updated state:', state.savedRecipes);
    }, [state.savedRecipes]);

    useEffect(() => {
        console.log('[SavedRecipesContextProvider] user changed:', user);
    }, [user]);



    return (
        <SavedRecipesContext.Provider value={{ ...state, dispatch }}>
            {children}
        </SavedRecipesContext.Provider>
    )
}