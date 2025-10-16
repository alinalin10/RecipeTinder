'use client';
import { useState } from 'react';

export default function MyRecipes() {
  const [search, setSearch] = useState('');
  
  const recipes = [
    { title: "Fluffy Berry Pancakes", image: "/pancakes.jpg" },
    { title: "Ultimate Veggie BLT", image: "/blt.jpg" },
    { title: "Chicken Lasagna", image: "/lasagna.jpg" },
    { title: "Strawberry Pie", image: "/pie.jpg" },
    { title: "Sweet Potato Salad", image: "/salad.jpg" },
    { title: "Cherry Macarons", image: "/macarons.jpg" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">      
        <h1 className="text-4xl font-bold mb-2 text-black">My Recipes</h1>
        <p className="text-gray-500 mb-8">
          All Your Favorite Dishes, Saved In One Place
        </p>

        <div className="flex flex-wrap justify-between gap-4 mb-8">
          <select className="p-2 border border-gray-300 rounded-md text-gray-600">
            <option>Sort by</option>
            <option>Name</option>
            <option>Recently Added</option>
          </select>
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
            .map((recipe, idx) => (
            <div
              key={idx}
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