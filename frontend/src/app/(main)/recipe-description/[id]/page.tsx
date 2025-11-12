'use client';
import { useParams } from 'next/navigation';
import React from 'react'
import { useRecipesInfoContext } from '../../../../hooks/useRecipesContext';
import styles from './recipe-description.module.css';

const RecipeDescription = () => {
    const { id } = useParams();
    const { recipes } = useRecipesInfoContext();

    // Find recipe by either _id or id field
    const recipe = recipes?.find((r: any) => r._id === id || r.id === id);

    if (!recipe) {
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
                <p style={{ marginBottom: '10px', fontSize: '20px' }}>Recipe not found in your saved recipes</p>
                <p style={{ fontSize: '14px', color: '#999' }}>
                    This recipe may be from an external source.
                    <br />
                    Try swiping right to save it, or go back to browse more recipes.
                </p>
            </div>
        );
    }

    return (
        <div className={styles['recipe_description_page']}>
            <div className={styles['picture']}>
                <img src={recipe.image} alt={recipe.title} className={styles['image']} />
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
