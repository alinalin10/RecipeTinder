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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load random recipes when page loads
  useEffect(() => {
    getRandomRecipes(10); // Fetch 10 random recipes from Spoonacular
  }, []);

  // Function to handle when cards run out - automatically fetch more
  const handleCardsEmpty = () => {
    console.log("Cards empty, fetching more recipes...");
    setIsRefreshing(true);
    getRandomRecipes(10);
  };

  // Reset refreshing state when new recipes arrive
  useEffect(() => {
    if (cardData.length > 0 && isRefreshing) {
      setIsRefreshing(false);
    }
  }, [cardData.length, isRefreshing]);

  // Fisher-Yates shuffle algorithm for unbiased randomization
  const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Interleave two arrays for even distribution
  const interleaveArrays = <T,>(arr1: T[], arr2: T[]): T[] => {
    const result: T[] = [];
    const maxLength = Math.max(arr1.length, arr2.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < arr1.length) result.push(arr1[i]);
      if (i < arr2.length) result.push(arr2[i]);
    }

    return result;
  };

  // Transform and merge both Spoonacular and user recipes
  useEffect(() => {
    // Transform Spoonacular recipes
    const spoonacularCards: CardData[] = (recipes && recipes.length > 0)
      ? recipes.map((recipe) => ({
          id: recipe.id,
          image: recipe.image,
          title: recipe.title,
          user: "Spoonacular",
          date: recipe.readyInMinutes
            ? `Ready in ${recipe.readyInMinutes} min`
            : "Time unknown",
          recipe: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`,
          recipeType: 'spoonacular',
          fullRecipeData: recipe,
        }))
      : [];

    // Transform user-created recipes
    const userCards: CardData[] = (userRecipes && userRecipes.length > 0)
      ? userRecipes.map((recipe: UserRecipe) => ({
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
          recipeType: 'userMade',
          fullRecipeData: recipe,
        }))
      : [];

    // Shuffle each array individually first
    const shuffledSpoonacular = fisherYatesShuffle(spoonacularCards);
    const shuffledUser = fisherYatesShuffle(userCards);

    // Interleave for even distribution, then shuffle again for extra randomness
    const interleaved = interleaveArrays(shuffledSpoonacular, shuffledUser);
    const finalShuffled = fisherYatesShuffle(interleaved);

    setCardData(finalShuffled);

    console.log(`🎲 Shuffled ${spoonacularCards.length} Spoonacular + ${userCards.length} User recipes`);
  }, [recipes, userRecipes]);

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

  // Auto-refreshing state (when cards run out)
  if (isRefreshing || (loading && cardData.length === 0)) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '20px', fontSize: '40px' }}>🔄</div>
        <p>{isRefreshing ? 'Loading more delicious recipes...' : 'Loading delicious recipes...'}</p>
      </div>
    );
  }

  // No recipes state (shouldn't happen with auto-refresh, but keep as fallback)
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
    <SwipeCards cardData={cardData} onCardsEmpty={handleCardsEmpty} />
  );
}
