"use client"
import { useRecipes, Recipe } from '../../hooks/useRecipes'
import { useEffect, useState } from 'react'

export default function RecipeTest() {
    const {
        recipes,
        loading,
        error,
        clearError,
        getRandomRecipes,
        searchRecipes,
        getRecipeById,
        getSimilarRecipes,
        findByIngredients
    } = useRecipes()

    const [searchQuery, setSearchQuery] = useState<string>('')
    const [ingredientsQuery, setIngredientsQuery] = useState<string>('chicken,rice')
    const [recipeIdQuery, setRecipeIdQuery] = useState<string>('')
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

    // Load random recipes when page loads
    useEffect(() => {
        getRandomRecipes(5)
    }, [])

    const handleSearch = () => {
        if (searchQuery) {
            searchRecipes(searchQuery, '', '', '', 5)
        }
    }

    const handleFindByIngredients = () => {
        if (ingredientsQuery) {
            findByIngredients(ingredientsQuery, 5)
        }
    }

    const handleGetRecipeDetails = async () => {
        if (recipeIdQuery) {
            const recipe = await getRecipeById(recipeIdQuery)
            setSelectedRecipe(recipe)
        }
    }

    const handleGetSimilar = (id: number) => {
        getSimilarRecipes(id, 4)
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>Recipe API Test Page</h1>
            <p style={{ color: '#666' }}>Test all the Spoonacular API endpoints</p>

            {/* Control Panel */}
            <div style={{
                background: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h2>Test Controls</h2>

                {/* Random Recipes */}
                <div style={{ marginBottom: '15px' }}>
                    <button
                        onClick={() => getRandomRecipes(5)}
                        style={{
                            padding: '10px 20px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Get 5 Random Recipes
                    </button>
                    <button
                        onClick={() => getRandomRecipes(5, 'vegetarian')}
                        style={{
                            padding: '10px 20px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Get Random Vegetarian Recipes
                    </button>
                </div>

                {/* Search */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search recipes (e.g., pasta, pizza)"
                        style={{
                            padding: '10px',
                            marginRight: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '300px'
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        style={{
                            padding: '10px 20px',
                            background: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Search Recipes
                    </button>
                </div>

                {/* Find by Ingredients */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={ingredientsQuery}
                        onChange={(e) => setIngredientsQuery(e.target.value)}
                        placeholder="Ingredients (comma-separated)"
                        style={{
                            padding: '10px',
                            marginRight: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '300px'
                        }}
                    />
                    <button
                        onClick={handleFindByIngredients}
                        style={{
                            padding: '10px 20px',
                            background: '#FF9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Find by Ingredients
                    </button>
                </div>

                {/* Get Recipe by ID */}
                <div style={{ marginBottom: '15px' }}>
                    <input
                        type="text"
                        value={recipeIdQuery}
                        onChange={(e) => setRecipeIdQuery(e.target.value)}
                        placeholder="Recipe ID (e.g., 716429)"
                        style={{
                            padding: '10px',
                            marginRight: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '300px'
                        }}
                    />
                    <button
                        onClick={handleGetRecipeDetails}
                        style={{
                            padding: '10px 20px',
                            background: '#9C27B0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Get Recipe Details
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{
                    padding: '20px',
                    background: '#E3F2FD',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    <p style={{ margin: 0 }}>Loading recipes...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{
                    padding: '20px',
                    background: '#FFEBEE',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <p style={{ margin: 0, color: '#C62828' }}>Error: {error}</p>
                    <button
                        onClick={clearError}
                        style={{
                            padding: '5px 10px',
                            background: '#C62828',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear
                    </button>
                </div>
            )}

            {/* Selected Recipe Details */}
            {selectedRecipe && (
                <div style={{
                    marginBottom: '20px',
                    padding: '20px',
                    border: '2px solid #4CAF50',
                    borderRadius: '8px',
                    background: '#F1F8E9'
                }}>
                    <h2>Recipe Details</h2>
                    <h3>{selectedRecipe.title}</h3>
                    {selectedRecipe.image && (
                        <img
                            src={selectedRecipe.image}
                            alt={selectedRecipe.title}
                            style={{ maxWidth: '400px', borderRadius: '8px' }}
                        />
                    )}
                    <p><strong>Ready in:</strong> {selectedRecipe.readyInMinutes} minutes</p>
                    <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                    {selectedRecipe.summary && (
                        <div>
                            <strong>Summary:</strong>
                            <div dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} />
                        </div>
                    )}
                    <button
                        onClick={() => handleGetSimilar(selectedRecipe.id)}
                        style={{
                            padding: '10px 20px',
                            background: '#673AB7',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Find Similar Recipes
                    </button>
                    <button
                        onClick={() => setSelectedRecipe(null)}
                        style={{
                            padding: '10px 20px',
                            background: '#9E9E9E',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            marginLeft: '10px'
                        }}
                    >
                        Close Details
                    </button>
                </div>
            )}

            {/* Display Recipes */}
            <div>
                <h2>Results: {recipes.length} recipes</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            style={{
                                border: '1px solid #ddd',
                                padding: '15px',
                                borderRadius: '8px',
                                background: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                transition: 'transform 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={async () => {
                                const details = await getRecipeById(recipe.id)
                                setSelectedRecipe(details)
                            }}
                        >
                            {recipe.image && (
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginBottom: '10px'
                                    }}
                                />
                            )}
                            <h3 style={{ marginTop: '10px', marginBottom: '10px' }}>
                                {recipe.title}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                <strong>ID:</strong> {recipe.id}
                            </p>
                            {recipe.readyInMinutes && (
                                <p style={{ fontSize: '14px', color: '#666' }}>
                                    <strong>Ready in:</strong> {recipe.readyInMinutes} min
                                </p>
                            )}
                            {recipe.servings && (
                                <p style={{ fontSize: '14px', color: '#666' }}>
                                    <strong>Servings:</strong> {recipe.servings}
                                </p>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleGetSimilar(recipe.id)
                                }}
                                style={{
                                    padding: '8px 16px',
                                    background: '#673AB7',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginTop: '10px'
                                }}
                            >
                                Find Similar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
