'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from './recipe-description.module.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop';

const RecipeDescription = () => {
    const params = useParams();
    const id = params?.id as string;
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                console.log('Fetching recipe with ID:', id);

                // Fetch from /api/userrecipes endpoint
                const response = await fetch(`http://localhost:4000/api/userrecipes/${id}`);

                if (!response.ok) {
                    throw new Error('Recipe not found');
                }

                const data = await response.json();
                console.log('Fetched recipe:', data);
                setRecipe(data);
            } catch (err) {
                console.error('Error fetching recipe:', err);
                setError(err instanceof Error ? err.message : 'Failed to load recipe');
            } finally {
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
            }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    const imageUrl = imgError ? FALLBACK_IMAGE : (recipe?.image || FALLBACK_IMAGE);

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
                    {error || 'This recipe may have been deleted or does not exist.'}
                    <br />
                    <a href="/myrecipes" style={{ color: '#ff6b6b', textDecoration: 'underline' }}>
                        Go back to My Recipes
                    </a>
                </p>
            </div>
        );
    }

    return (
        <div className={styles['recipe_description_page']}>
            <div className={styles['picture']}>
                <img 
                    src={imageUrl} 
                    alt={recipe.title} 
                    className={styles['image']}
                    onError={() => setImgError(true)}
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
