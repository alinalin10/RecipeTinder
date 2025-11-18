'use client';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';

interface SavedRecipe {
  _id: string;
  recipeId: number | string;
  recipeType: 'spoonacular' | 'userMade';
  action: 'liked' | 'bookmarked';
  recipeTitle: string;
  recipeImage?: string;
  savedAt: string;
}

export default function MyRecipesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch saved recipes from backend
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        console.log('🔍 Starting to fetch saved recipes...');

        const userJson = localStorage.getItem('user');
        console.log('📦 User from localStorage:', userJson ? 'Found' : 'Not found');

        if (!userJson) {
          console.log('❌ No user in localStorage, redirecting to login');
          router.push('/login');
          return;
        }

        const user = JSON.parse(userJson);
        const token = user?.token;

        console.log('🔑 Token exists:', !!token);
        console.log('👤 User ID:', user?._id || user?.id || 'Not found');

        if (!token) {
          console.log('❌ No token found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('🌐 Fetching from: http://localhost:4000/api/swipe');
        const response = await fetch('http://localhost:4000/api/swipe', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response not OK:', errorText);
          throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Fetched data:', data);
        console.log('📊 Number of recipes:', data.recipes?.length || 0);
        console.log('🍽️ Recipes array:', data.recipes);

        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('❌ Error fetching recipes:', err);
        setError(`Failed to load recipes: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [router]);

  // Delete a saved recipe
  const deleteRecipe = async (recipeId: number | string) => {
    try {
      const userJson = localStorage.getItem('user');
      const token = userJson ? JSON.parse(userJson).token : null;

      const response = await fetch(`http://localhost:4000/api/swipe/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Remove from local state
      setRecipes(prev => prev.filter(r => r.recipeId !== recipeId));
    } catch (err) {
      console.error('Error deleting recipe:', err);
      alert('Failed to delete recipe');
    }
  };

  // Toggle bookmark status
  const toggleBookmark = async (recipe: SavedRecipe) => {
    try {
      const userJson = localStorage.getItem('user');
      const token = userJson ? JSON.parse(userJson).token : null;

      const newAction = recipe.action === 'bookmarked' ? 'liked' : 'bookmarked';

      const response = await fetch('http://localhost:4000/api/swipe/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipeId: recipe.recipeId,
          recipeType: recipe.recipeType,
          recipeTitle: recipe.recipeTitle,
          recipeImage: recipe.recipeImage,
          action: newAction
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      // Update local state
      setRecipes(prev => prev.map(r =>
        r.recipeId === recipe.recipeId ? { ...r, action: newAction } : r
      ));
    } catch (err) {
      console.error('Error updating recipe:', err);
    }
  };

  // Filter recipes
  const filteredRecipes = recipes
    .filter(recipe => recipe.recipeTitle.toLowerCase().includes(search.toLowerCase()))
    .filter(recipe => {
      if (sortBy === 'bookmarked') return recipe.action === 'bookmarked';
      if (sortBy === 'liked') return recipe.action === 'liked';
      return true;
    });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'name') return a.recipeTitle.localeCompare(b.recipeTitle);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2 text-black">My Recipes</h1>
        <p className="text-gray-500 mb-8">
          All Your Favorite Dishes, Saved In One Place ({recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'})
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
              <option value="liked">Liked Only</option>
              <option value="bookmarked">Bookmarked Only</option>
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

        {/* No Recipes Message */}
        {sortedRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {search ? 'No recipes match your search' : 'No saved recipes yet'}
            </p>
            {!search && (
              <p className="text-gray-400">
                Start swiping right on recipes you like to save them here!
              </p>
            )}
          </div>
        )}

        {/* Recipes Grid */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3">
          {sortedRecipes.map(recipe => (
            <div
              key={recipe._id}
              className="rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
              style={{ backgroundColor: '#FAFAF5' }}
            >
              <div className="relative">
                {recipe.recipeImage ? (
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeTitle}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML +=
                        '<div class="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center"><p class="text-gray-500 text-sm">Image not available</p></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No image</p>
                  </div>
                )}

                {/* Action Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded-full text-xs font-semibold">
                  {recipe.action === 'bookmarked' ? '🔖 Bookmarked' : '❤️ Liked'}
                </div>
              </div>

              <h2 className="text-lg font-semibold mb-3 text-black">{recipe.recipeTitle}</h2>

              <p className="text-xs text-gray-500 mb-4">
                Saved on {new Date(recipe.savedAt).toLocaleDateString()}
              </p>

              <div className="flex justify-around pt-4 mt-4 border-t border-gray-300">
                <button
                  onClick={() => toggleBookmark(recipe)}
                  className="hover:text-pink-600 transition-colors"
                  aria-label={recipe.action === 'bookmarked' ? 'Remove bookmark' : 'Bookmark recipe'}
                  title={recipe.action === 'bookmarked' ? 'Remove bookmark' : 'Bookmark recipe'}
                >
                  <img
                    src="/bookmark.png"
                    alt="Bookmark"
                    className="w-6 h-6"
                    style={{
                      filter: recipe.action === 'bookmarked' ? 'none' : 'grayscale(100%)',
                      opacity: recipe.action === 'bookmarked' ? 1 : 0.5
                    }}
                  />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Remove "${recipe.recipeTitle}" from your saved recipes?`)) {
                      deleteRecipe(recipe.recipeId);
                    }
                  }}
                  className="hover:text-red-600 transition-colors"
                  aria-label="Delete recipe"
                  title="Delete recipe"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <a
                  href={recipe.recipeType === 'spoonacular'
                    ? `https://spoonacular.com/recipes/${recipe.recipeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${recipe.recipeId}`
                    : `/recipe-description/${recipe.recipeId}`}
                  target={recipe.recipeType === 'spoonacular' ? '_blank' : '_self'}
                  rel={recipe.recipeType === 'spoonacular' ? 'noopener noreferrer' : ''}
                  className="hover:text-pink-600 transition-colors"
                  aria-label="View recipe"
                  title="View recipe"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}