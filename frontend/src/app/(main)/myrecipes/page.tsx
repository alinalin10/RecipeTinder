'use client';
import { useState, useEffect } from 'react';
import { useSavedRecipesContext } from '@/hooks/useSavedRecipesContext';

export default function MyRecipesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const { savedRecipes } = useSavedRecipesContext();

  useEffect(() => {
    console.log("Saved recipes updated in MyRecipesPage:", savedRecipes);
  }, [savedRecipes]);


  const [likedRecipes, setLikedRecipes] = useState<Set<string | number>>(new Set());
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Set<string | number>>(new Set());

  // like
  const toggleLike = (id: string | number) => {
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // bookmark
  const toggleBookmarked = (id: string | number) => {
    setBookmarkedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Filter recipes
  const filteredRecipes = (savedRecipes ?? [])
    .filter(recipe => recipe.recipeTitle.toLowerCase().includes(search.toLowerCase()))
    .filter(recipe => {
      if (sortBy === 'bookmarked') return bookmarkedRecipes.has(recipe._id);
      return true;
    });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'name') return a.recipeTitle.localeCompare(b.recipeTitle);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 text-black">My Recipes</h1>
        <p className="text-gray-500 mb-8">
          All Your Favorite Dishes, Saved In One Place
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-2 pr-10 border border-gray-300 rounded-md text-gray-600 appearance-none bg-white cursor-pointer"
              aria-label="Sort recipes"
            >
              <option value="all">All Recipes</option>
              <option value="name">Sort by Name</option>
              <option value="bookmarked">Bookmarked</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search My Recipes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 max-w-xs p-2 border border-gray-300 rounded-md text-gray-600"
            aria-label="Search recipes"
          />
        </div>

        {/* Recipes Grid */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {sortedRecipes.map(recipe => (
            <div
              key={recipe._id}
              className="rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
              style={{ backgroundColor: '#f5f1e8' }}
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.recipeTitle}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={() => toggleLike(recipe._id)}
                  className="absolute bottom-2 left-2 hover:text-pink-600 transition-colors"
                  aria-label={likedRecipes.has(recipe._id) ? 'Unlike recipe' : 'Like recipe'}
                >
                  <img src="/heart.png" alt="Like" className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-lg font-semibold mb-3 text-black">{recipe.recipeTitle}</h2>

              <div className="flex justify-around pt-8 mt-4">
                <button
                  onClick={() => alert('List of Ingredients:')}
                  className="hover:text-pink-600 transition-colors"
                  aria-label="Show ingredients"
                >
                  <img src="/cart.png" alt="Cart" className="w-6 h-6" />
                </button>
                <button
                  onClick={() => toggleBookmarked(recipe._id)}
                  className="hover:text-pink-600 transition-colors"
                  aria-label={bookmarkedRecipes.has(recipe._id) ? 'Remove bookmark' : 'Bookmark recipe'}
                >
                  <img
                    src="/bookmark.png"
                    alt="Bookmark"
                    className="w-6 h-6"
                    style={{
                      filter: bookmarkedRecipes.has(recipe._id) ? 'none' : 'grayscale(100%)',
                      opacity: bookmarkedRecipes.has(recipe._id) ? 1 : 0.5
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
