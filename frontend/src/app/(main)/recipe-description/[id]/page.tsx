'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './recipe-description.module.css';

const RecipeDescription = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user') || '{}')?.token;
                
                // Check if ID is a number (Spoonacular) or MongoDB ObjectId (user recipe)
                const isSpoonacular = !isNaN(Number(id));
                
                let recipeData;
                
                if (isSpoonacular) {
                    // Fetch from YOUR backend (which calls Spoonacular)
                    const response = await fetch(`http://localhost:4000/api/spoonacular/${id}`);
                    
                    if (!response.ok) throw new Error('Spoonacular recipe not found');
                    
                    const result = await response.json();
                    recipeData = result.data;
                    
                    // Transform Spoonacular data to match your format
                    setRecipe({
                        id: recipeData.id,
                        title: recipeData.title,
                        image: recipeData.image,
                        user: recipeData.sourceName || 'Spoonacular',
                        servings: recipeData.servings,
                        prepTime: recipeData.preparationMinutes,
                        cookTime: recipeData.cookingMinutes,
                        description: recipeData.summary?.replace(/<[^>]*>/g, ''), // Remove HTML tags
                        ingredients: recipeData.extendedIngredients?.map((ing: any) => ing.original) || [],
                        steps: recipeData.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
                        cuisine: recipeData.cuisines?.[0],
                        course: recipeData.dishTypes?.[0],
                        difficulty: 'N/A',
                        calories: recipeData.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 'N/A'
                    });
                } else {
                    // Fetch user-made recipe from your backend
                    const response = await fetch(
                        `http://localhost:4000/api/recipes/${id}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );

                    if (!response.ok) throw new Error('Recipe not found');

                    const data = await response.json();
                    setRecipe(data.data);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch recipe:', err);
                setError(true);
                setLoading(false);
            }
        };

        if (id) {
            fetchRecipe();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px'
            }}>
                Loading recipe...
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '18px',
                color: '#666',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🍳</div>
                <p style={{ marginBottom: '10px', fontSize: '20px' }}>Recipe not found</p>
                <p style={{ fontSize: '14px', color: '#999' }}>
                    This recipe may not exist or you may not have access to it.
                </p>
            </div>
        );
    }

    return (
        <div className={styles['recipe_description_page']}>
            <div className={styles['picture']}>
                <img 
                    src={recipe.image || 'https://images.unsplash.com/photo-1556910110-a5a63dfd393c?w=800'} 
                    alt={recipe.title} 
                    className={styles['image']} 
                />
            </div>

            <h1 className={styles['food_name']}>{recipe.title}</h1>

            <p className={styles['user']}>Recipe by {recipe.user}</p>
            <hr />

            <div className={styles['labels']}>
                <p className={styles['course']}>Course: </p>
                <p className={styles['item-info']}>{recipe.course || 'N/A'}</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['difficulty']}>Difficulty: </p>
                <p className={styles['item-info']}>{recipe.difficulty || 'N/A'}</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['cuisine']}>Cuisine: </p>
                <p className={styles['item-info']}>{recipe.cuisine || 'N/A'}</p>
            </div>

            <p className={styles['description']}>{recipe.description || 'No description available.'}</p>

            <div className={styles['info']}>
                <div className={styles['serving-size']}>
                    <p className={styles['info-title']}>Serving Size</p>
                    <img src="/serving-size.png" alt="servings" />
                    <p>{recipe.servings || 'N/A'}</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['prep-time']}>
                    <p className={styles['info-title']}>Prep Time</p>
                    <img src="/prep-time.png" alt="prep time" />
                    <p>{recipe.prepTime ? `${recipe.prepTime} minutes` : 'N/A'}</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['cooking-time']}>
                    <p className={styles['info-title']}>Cooking Time</p>
                    <img src="/cooking-time.png" alt="cook time" />
                    <p>{recipe.cookTime ? `${recipe.cookTime} minutes` : 'N/A'}</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['calories']}>
                    <p className={styles['info-title']}>Calories</p>
                    <img src="/calories.png" alt="calories" />
                    <p>{recipe.calories || 'N/A'}</p>
                </div>
            </div>

            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className={styles['ingredients-section']}>
                    <h3 className={styles['list-title']}>Ingredients</h3>
                    <ul className={styles['shadow-bullets']}>
                        {recipe.ingredients.map((ingredient: string, idx: number) => (
                            <li key={idx}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}

            {recipe.steps && recipe.steps.length > 0 && (
                <div className={styles['instructions-section']}>
                    <h3 className={styles['list-title']}>Instructions</h3>
                    <ol>
                        {recipe.steps.map((step: string, idx: number) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};

export default RecipeDescription;