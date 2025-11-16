'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSavedRecipesContext } from '@/hooks/useSavedRecipesContext';

export default function MyRecipesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const { savedRecipes } = useSavedRecipesContext();

  useEffect(() => {
    console.log('Saved recipes updated in MyRecipesPage:', savedRecipes);
  }, [savedRecipes]);

  const normalizeId = (id: string | number) => String(id);

  // Filter recipes
  const filteredRecipes = (savedRecipes ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((recipe: any) => recipe.recipeTitle.toLowerCase().includes(search.toLowerCase()))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((recipe: any) => {
      if (sortBy === 'bookmarked') {
        return true;
      }
      return true;
    });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .sort((a: any, b: any) => {
      if (sortBy === 'name') return a.recipeTitle.localeCompare(b.recipeTitle);
      return 0;
    });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 text-black">My Recipes</h1>
        <p className="text-gray-500 mb-8">All Your Favorite Dishes, Saved In One Place</p>

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
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {sortedRecipes.map((recipe: any) => {
            const idForUI = normalizeId(recipe._id);
            return (
              <div
                key={idForUI}
                className="rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
                style={{ backgroundColor: '#FAFAF5' }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.recipeTitle}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <h2 className="text-lg font-semibold mb-3 text-black">{recipe.recipeTitle}</h2>


                {/* View Recipe button - links to recipe detail page */}
                <div className="mt-4">
                  {recipe.recipeType === 'spoonacular' ? (
                    <a
                      href={`https://spoonacular.com/recipes/${encodeURIComponent(String(recipe.recipeId))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 text-white rounded hover:brightness-90 transition-colors"
                      style={{ backgroundColor: '#F95968' }}
                    >
                      View Recipe ↗
                    </a>
                  ) : (
                    <Link
                      href={`/recipe-description/${encodeURIComponent(String(recipe.recipeId))}`}
                      className="inline-block px-4 py-2 text-white rounded hover:brightness-90 transition-colors"
                      style={{ backgroundColor: '#F95968' }}
                    >
                      View Recipe
                    </Link>
                  )}
                </div>
                {/* <div className="pt-4 mt-2 text-sm text-gray-700">
                  <p className="mt-1">Saved at: {new Date(recipe.savedAt || recipe.createdAt || Date.now()).toLocaleString()}</p>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}