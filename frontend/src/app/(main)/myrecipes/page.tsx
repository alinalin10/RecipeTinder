'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyRecipesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const router = useRouter();

  const [likedRecipes, setLikedRecipes] = useState<Set<string | number>>(new Set());
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Set<string | number>>(new Set());

  // like
  const toggleLike = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    setLikedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // bookmark
  const toggleBookmarked = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    setBookmarkedRecipes(prev => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  // Navigate to recipe details
  const handleRecipeClick = (recipeId: string | number) => {
    router.push(`/recipe-description/${recipeId}`);
  };

  // Filter recipes
  const filteredRecipes = savedRecipes
    .filter(recipe => {
      const title = recipe.title || recipe.recipeTitle || '';
      return title.toLowerCase().includes(search.toLowerCase());
    })
    .filter(recipe => {
      if (sortBy === 'bookmarked') return bookmarkedRecipes.has(recipe.recipeId);
      return true;
    });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'name') {
      const titleA = a.title || a.recipeTitle || '';
      const titleB = b.title || b.recipeTitle || '';
      return titleA.localeCompare(titleB);
    }
    return 0;
  });

  const fetchSavedRecipeswithDetails = async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    
    const response = await fetch('http://localhost:4000/api/swipe/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();
    const savedRecipesList = data.recipes || []; // NOW it's defined!
    
    console.log('📋 Saved recipe IDs:', savedRecipesList);

    const recipesWithFullData = await Promise.all(
      savedRecipesList.map(async (savedRecipe) => {
        try {
          // Fetch the full recipe data
          const detailResponse = await fetch(
            `http://localhost:4000/api/recipes/${savedRecipe.recipeId}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          
          if (!detailResponse.ok) {
            throw new Error('Recipe not found');
          }
          
          const fullRecipeData = await detailResponse.json();
          
          console.log(`✅ Loaded recipe: ${fullRecipeData.title}`);
          
          // Combine saved metadata (action, savedAt) with full recipe data
          return {
            ...fullRecipeData.data,
            recipeId: savedRecipe.recipeId,
            action: savedRecipe.action,
            savedAt: savedRecipe.savedAt,
            recipeType: savedRecipe.recipeType
          };
        } catch (err) {
          console.error(`❌ Failed to fetch recipe ${savedRecipe.recipeId}:`, err);
          // Return a fallback object so the UI doesn't break
          return {
            recipeId: savedRecipe.recipeId,
            title: savedRecipe.recipeTitle,
            recipeTitle: savedRecipe.recipeTitle,
            image: 'https://img.freepik.com/premium-photo/cutting-board-with-knife-knife-it_865967-240613.jpg',
            action: savedRecipe.action,
            savedAt: savedRecipe.savedAt,
            recipeType: savedRecipe.recipeType
          };
        }
      })
    ); //this is an array not a function of savedRecipesList with all the details added
    
    console.log('🎉 All recipes with full data:', recipesWithFullData);
    setSavedRecipes(recipesWithFullData); //whatever the API returns (backend controller)
  };

  useEffect(() => {
    fetchSavedRecipeswithDetails(); //only fetch once when component mounts
  }, []);

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
              key={recipe.recipeId}
              onClick={() => handleRecipeClick(recipe.recipeId)}
              className="rounded-xl p-4 shadow hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
              style={{ backgroundColor: '#f5f1e8' }}
            >
              <div className="relative">
                <img
                  src={recipe.image || 'https://img.freepik.com/premium-photo/cutting-board-with-knife-knife-it_865967-240613.jpg'}
                  alt={recipe.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <button
                  onClick={(e) => toggleLike(e, recipe.recipeId)} 
                  className="absolute bottom-2 left-2 hover:text-pink-600 transition-colors"
                  aria-label={likedRecipes.has(recipe.recipeId) ? 'Unlike recipe' : 'Like recipe'}
                >
                  <img src="/heart.png" alt="Like" className="w-6 h-6" />
                </button>
              </div>

              <h2 className="text-lg font-semibold mb-3 text-black">{recipe.title}</h2>

              <div className="flex justify-around pt-8 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('List of Ingredients:');
                  }}
                  className="hover:text-pink-600 transition-colors"
                  aria-label="Show ingredients"
                >
                  <img src="/cart.png" alt="Cart" className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => toggleBookmarked(e, recipe.recipeId)}
                  className="hover:text-pink-600 transition-colors"
                  aria-label={bookmarkedRecipes.has(recipe.recipeId) ? 'Remove bookmark' : 'Bookmark recipe'}
                >
                  <img
                    src="/bookmark.png"
                    alt="Bookmark"
                    className="w-6 h-6"
                    style={{
                      filter: bookmarkedRecipes.has(recipe.recipeId) ? 'none' : 'grayscale(100%)',
                      opacity: bookmarkedRecipes.has(recipe.recipeId) ? 1 : 0.5
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
