'use client';
import { useParams } from 'next/navigation';
import React, { useState, useContext } from 'react'
import { useRecipesInfoContext } from '../../../../../hooks/useRecipesContext';
import styles from './recipe-description.module.css';

const RecipeDescription = () => {
    const { id } = useParams(); // id comes from the [id] segment
    const { recipes } = useRecipesInfoContext();

    const recipe = recipes?.find((r: { id: string }) => r.id === id);
    if (!recipe) {
        return <p>Loading recipe...</p>;
    }

    return (
        <div className={styles['recipe_description_page']}>
            <div className={styles['picture']}>
                <img src={recipe.image} alt={recipe.name} className={styles['image']}></img>
            </div>

            <h1 className={styles['food_name']}>{recipe.name}</h1>

            <p className={styles['user']}>Recipe by {recipe.user}</p>
            <hr/>

            <div className={styles['labels']}>
                <p className={styles['course']}>Course: </p>
                <p className={styles['item-info']}>{recipe.course}</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['difficulty']}>Difficulty: </p>
                <p className={styles['item-info']}>{recipe.difficulty}</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['cuisine']}>Cuisine: </p>
                <p className={styles['item-info']}>{recipe.cuisine}</p>
            </div>

            <p className={styles['description']}>{recipe.description}</p>

            <div className={styles['info']}>
                <div className={styles['serving-size']}>
                    <p className={styles['info-title']}>Serving Size</p>
                    <img src="/serving-size.png" alt="x"/>
                    <p>{recipe.serving_size} servings</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['prep-time']}>
                    <p className={styles['info-title']}>Prep Time</p>
                    <img src="/prep-time.png" alt="x"/>
                    <p>{recipe.prep_time} minutes</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['cooking-time']}>
                    <p className={styles['info-title']}>Cooking Time</p>
                    <img src="/cooking-time.png" alt="x"/>
                    <p>{recipe.cooking_time} minutes</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['calories']}>
                    <p className={styles['info-title']}>Calories</p>
                    <img src="/calories.png" alt="x"/>
                    <p>{recipe.calories} kcal</p>
                </div>
            </div>
            <div className={styles['ingredients-section']}>
                <h3 className={styles['list-title']}>Ingredients</h3>
                <ul className={styles['shadow-bullets']}>
                    {recipe.ingredients.map((ingredient: string, idx: number) => (
                        <li key={idx}>{ingredient}</li>
                    ))}
                </ul>
            </div>
            
            <div className={styles['instructions-section']}>
                <h3 className={styles['list-title']}>Instructions</h3>
                <ol>
                    {recipe.instructions.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default RecipeDescription;