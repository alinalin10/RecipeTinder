'use client';
import { createContext, useContext, useState } from 'react';

const RecipesContext = createContext();

export function RecipesProvider({ children }) {
  const [recipes] = useState([
    { id: 1, title: "Fluffy Berry Pancakes", image: "/pancakes.png" },
    { id: 2,  title: "Ultimate Veggie BLT", image: "/blt.jpg" },
    { id: 3, title: "Chicken Lasagna", image: "/lasagna.jpg" },
    { id: 4, title: "Strawberry Pie", image: "/pie.jpg" },
    { id: 5, title: "Sweet Potato Salad", image: "/salad.jpg" },
    { id: 6, title: "Cherry Macarons", image: "/macarons.jpg" },
  ]);

  return (
    <RecipesContext.Provider value={{ recipes }}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipesProvider');
  }
  return context;
}