'use client';
import { useState } from 'react';
import { useRecipes } from '../../../../context/RecipesContext';

export default function MyRecipes() {
  const [search, setSearch] = useState('');
  const { recipes } = useRecipes();
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">      
        <h1 className="text-4xl font-bold mb-2 text-black">My Recipes</h1>
        <p className="text-gray-500 mb-8">
          All Your Favorite Dishes, Saved In One Place
        </p>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="relative">
            <select className="p-2 pr-10 border border-gray-300 rounded-md text-gray-600 appearance-none bg-white cursor-pointer">
              <option>Sort by</option>
              <option>Name</option>
              <option>Recently Added</option>
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
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs p-2 border border-gray-300 rounded-md text-gray-600"
          />
        </div>

        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {recipes
            .filter(recipe => recipe.title.toLowerCase().includes(search.toLowerCase()))
            .map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-100 rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <button className="absolute bottom-2 left-2 hover:text-pink-600 transition-colors">
                  <img src="/heart.png" alt="Like" className="w-6 h-6" />
                </button>
              </div>
              
              <h2 className="text-lg font-semibold mb-3 text-black">{recipe.title}</h2>

              <div className="flex justify-around pt-8 mt-4">
                <button className="hover:text-pink-600 transition-colors">
                  <img src="/bookmark.png" alt="Bookmark" className="w-6 h-6" />
                </button>
                <button className="hover:text-pink-600 transition-colors">
                  <img src="/cart.png" alt="Cart" className="w-6 h-6" />
                </button>
                <button className="hover:text-pink-600 transition-colors">
                  <img src="/checkMark.png" alt="Done" className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}