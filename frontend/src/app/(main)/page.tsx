"use client"

import SwipeCards from '../components/SwipeCard';
import { useRecipes, Recipe } from '../../hooks/useRecipes';
import { useEffect, useState } from 'react';

// Define types for card data
interface CardData {
  id: number;
  url?: string;  // Optional because not all recipes have images
  name: string;
  user: string;
  date: string;
  recipe: string;
  // Full recipe data for detailed view
  fullRecipeData: Recipe;
}

export default function Home() {
  const { recipes, loading, error, getRandomRecipes } = useRecipes();
  const [cardData, setCardData] = useState<CardData[]>([]);

  // Load random recipes when page loads
  useEffect(() => {
    getRandomRecipes(10); // Fetch 10 random recipes
  }, []);

  // Transform Spoonacular recipe data to card format
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      const transformedCards = recipes.map((recipe) => ({
        id: recipe.id,
        url: recipe.image,
        name: recipe.title,
        user: "@Spoonacular",
        date: recipe.readyInMinutes
          ? `Ready in ${recipe.readyInMinutes} min`
          : "Time unknown",
        recipe: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
        fullRecipeData: recipe, // Include complete recipe data
      }));
      setCardData(transformedCards);
    }
  }, [recipes]);

  // Loading state
  if (loading && cardData.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px',
        color: '#666'
      }}>
        Loading delicious recipes...
      </div>
    );
  }

  // Error state
  if (error && cardData.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#C62828'
      }}>
        <p>Error loading recipes: {error}</p>
        <button
          onClick={() => getRandomRecipes(10)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No recipes state
  if (cardData.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <p>No recipes found. Fetching more...</p>
        <button
          onClick={() => getRandomRecipes(10)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Load Recipes
        </button>
      </div>
    );
  }
  return (
    <SwipeCards cardData={cardData} />
  );
}
