"use client"

import SwipeCards from '../components/SwipeCard';
import { useRecipes, Recipe } from '../../hooks/useRecipes';
import { useRecipesInfoContext } from '../../hooks/useRecipesContext';
import { useEffect, useState } from 'react';
import { type CardData } from '../components/Card';

// User Recipe type from backend
interface UserRecipe {
  _id: string;
  title: string;
  user?: string;
  course?: string;
  servings?: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  calories?: string;
  cuisine?: string;
  difficulty?: string;
  steps?: string[];
  image?: string;
  ingredients?: string[];
  time?: number;
}

export default function Home() {
  const { recipes, loading, error, getRandomRecipes } = useRecipes();
  const recipesContext = useRecipesInfoContext();
  const userRecipes = recipesContext?.recipes || [];
  const [cardData, setCardData] = useState<CardData[]>([]);

  // Load random recipes when page loads
  useEffect(() => {
    getRandomRecipes(10); // Fetch 10 random recipes from Spoonacular
  }, []);

  // Transform and merge both Spoonacular and user recipes
  useEffect(() => {
    const transformedCards: CardData[] = [];

    // Transform Spoonacular recipes
    if (recipes && recipes.length > 0) {
      const spoonacularCards = recipes.map((recipe) => ({
        id: recipe.id,
        url: recipe.image,
        name: recipe.title,
        user: "Spoonacular",
        date: recipe.readyInMinutes
          ? `Ready in ${recipe.readyInMinutes} min`
          : "Time unknown",
        recipe: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
        fullRecipeData: recipe,
      }));
      transformedCards.push(...spoonacularCards);
    }

    // Transform user-created recipes
    if (userRecipes && userRecipes.length > 0) {
      const userCards = userRecipes.map((recipe: UserRecipe) => ({
        _id: recipe._id,
        image: recipe.image,
        title: recipe.title,
        user: recipe.user || "Community",
        difficulty: recipe.difficulty,
        date: recipe.time
          ? `${recipe.time} min`
          : (recipe.prepTime && recipe.cookTime)
            ? `${recipe.prepTime + recipe.cookTime} min`
            : "Time varies",
        recipe: `/recipe-description/${recipe._id}`,
        fullRecipeData: recipe,
      }));
      transformedCards.push(...userCards);
    }

    // Shuffle the combined array for variety
    const shuffled = transformedCards.sort(() => Math.random() - 0.5);
    setCardData(shuffled);
  }, [recipes, userRecipes]);

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
