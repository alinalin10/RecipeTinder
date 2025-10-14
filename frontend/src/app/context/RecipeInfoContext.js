'use client';
import { createContext, useState, useReducer, useEffect } from 'react'

export const RecipesInfoContext = createContext()

export const recipesReducer = (state, action) => {
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

const exampleRecipes = [
    {
        id: 1,
        image: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/10/11/1/FNK_Simple-Homemade-Pancakes_s4x3.jpg.rend.hgtvcom.616.462.suffix/1476216522537.webp",
        name: "Pancakes",
        user: "@user",
        course: "Breakfast",
        difficulty: "Medium",
        cuisine: "American",
        description: "Flat, round cake made from a batter of flour, eggs, and milk, which is cooked on a hot surface like a griddle or frying pan",
        serving_size: "20",
        prep_time: "30",
        cooking_time: "20",
        calories: "350",
        ingredients: ["Flour", "Sugar", "Milk", "Eggs"],
        instructions: [
            "In a large bowl, whisk together the flour, sugar, baking powder, and salt until they are well combined.",
            "Let the batter rest for 10 minutes. This allows the ingredients to fully hydrate, which creates a fluffier texture.",
            "Pour about ¼ cup of batter per pancake onto the hot skillet. Cook for 1 to 2 minutes, or until you see bubbles form on the surface and the edges look set.",
            "Carefully flip the pancakes and cook for another 1 to 2 minutes, until golden brown."
        ],
        rating: "⭐ 4.5",
        date: "September 10, 2025",
        recipe: "#",
    },
    {
        id: 2,
        image: "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-4.jpg",
        name: "Cookies",
        user: "@user",
        course: "Snack",
        difficulty: "Easy",
        cuisine: "Persian??",
        description: "A classic American dessert, typically described as a tender, chewy cookie with pockets of melty chocolate chips",
        serving_size: "20",
        prep_time: "30 minutes",
        cooking_time: "20 minutes",
        calories: "350 kcal",
        ingredients: ["Chocolate Chips", "Flour", "Sugar", "Baking Soda", "Eggs", "Vanilla Extract"],
        instructions: [
            "Once butter/sugar mixture is beaten well, add the eggs & vanilla and beat to combine.",
            "Use LOTS of chocolate chips. You want at least two gooey chocolate chips in every bite.",
            "At this point you can either bake your dough or freeze it.",
            "If you are baking the cookies immediately simply roll them into balls, place them evenly apart on a baking sheet (about 1.5 to 2 inches apart) and bake at 375 degrees for 8-10 minutes."
        ],
        rating: "⭐ 4.5",
        date: "October 10, 2025",
        recipe: "#",
    },
];

export const RecipesInfoContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(recipesReducer, {
        recipes: exampleRecipes
    })

    // for when the backend database is setup - can changle recipes: exampleRecipes to recipes: null as well in the line above and delete example data

    /*useEffect(() => {
        const fetchRecipes = async () => {
            const response = await fetch('/api/recipes');
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_RECIPES', payload: json });
            }
        };

        fetchRecipes();
    }, []);*/


    return (
        <RecipesInfoContext.Provider value={{ ...state, dispatch }}>
            {children}
        </RecipesInfoContext.Provider>
    )
}