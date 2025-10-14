'use client';
import React, { useState } from 'react'
import styles from './recipe-description.module.css';

const foodData = [
    {
        id: 1,
        image: "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-4.jpg",
        name: "Cookies",
        user: "@user",
        course: "Snack",
        difficulty: "Easy",
        cuisine: "Persia??",
        description: "Delicious",
        serving_size: "20",
        prep_time: "30 minutes",
        cooking_time: "20 minutes",
        calories: "350 kcal",
        ingredients: "idk",
        instructions: "idk",
    },
]

const RecipeDescription = () => {
    return (
        <div className={styles['recipe_description_page']}>
            <div className={styles['picture']}>
                <img src="https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-4.jpg" alt="Cookies" className={styles['image']}></img>
            </div>

            <h1 className={styles['food_name']}>Cookies</h1>

            

            <p className={styles['user']}>Recipe by James</p>
            <hr/>

            <div className={styles['labels']}>
                <p className={styles['course']}>Course: </p>
                <p className={styles['item-info']}>Dinner</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['difficulty']}>Difficulty: </p>
                <p className={styles['item-info']}>Easy</p>
                <div className={styles["vertical-line"]}></div>
                <p className={styles['cuisine']}>Cuisine: </p>
                <p className={styles['item-info']}>Italian</p>
            </div>

            <p className={styles['description']}>Delicious and healthy meal option when you are short on time!</p>

            <div className={styles['info']}>
                <div className={styles['serving-size']}>
                    <p className={styles['info-title']}>Serving Size</p>
                    <img src="/serving-size.png" alt="x" className={styles['icon-x']}/>
                    <p>2 servings</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['prep-time']}>
                    <p className={styles['info-title']}>Prep Time</p>
                    <img src="/prep-time.png" alt="x" className={styles['icon-x']}/>
                    <p>10 minutes</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['cooking-time']}>
                    <p className={styles['info-title']}>Cooking Time</p>
                    <img src="/cooking-time.png" alt="x" className={styles['icon-x']}/>
                    <p>20 minutes</p>
                </div>

                <div className={styles["vertical-line"]}></div>

                <div className={styles['calories']}>
                    <p className={styles['info-title']}>Calories</p>
                    <img src="/calories.png" alt="x" className={styles['icon-x']}/>
                    <p>350 kcal</p>
                </div>
            </div>
            <div className={styles['ingredients-section']}>
                <h3 className={styles['list-title']}>Ingredients</h3>
                <ul className={styles['shadow-bullets']}>
                    <li>Milk</li>
                    <li>Eggs</li>
                    <li>Bread</li>
                    <li>Cheese</li>
                </ul>
            </div>
            
            <div className={styles['instructions-section']}>
                <h3 className={styles['list-title']}>Instructions</h3>
                <ol>
                    <li>Once butter/sugar mixture is beaten well, add the eggs & vanilla and beat to combine.</li>
                    <li>Use LOTS of chocolate chips. You want at least two gooey chocolate chips in every bite.</li>
                    <li>At this point you can either bake your dough or freeze it.</li>
                    <li>If you are baking the cookies immediately simply roll them into balls, place them evenly apart on a baking sheet (about 1.5 to 2 inches apart) and bake at 375 degrees for 8-10 minutes.</li>
                </ol>
            </div>
        </div>
    );
};

export default RecipeDescription;