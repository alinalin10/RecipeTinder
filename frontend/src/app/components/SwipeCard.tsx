"use client";

import React, { useState, useEffect } from 'react'
import Card, { type CardData } from './Card'
import styles from './swipeCards.module.css';


// Returns the stack of cards and all their data
const SwipeCards = ({ cardData }: { cardData: CardData[] }) => {
    const [cards, setCards] = useState<CardData[]>(cardData ?? []);

      const saveRecipe = async (recipeId: number | string, recipeType: string, recipeTitle: string, action: string) => {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

        console.log('Token value:', token); // ADD THIS
        console.log('Token length:', token?.length); // ADD THIS

        console.log('Token exists:', !!token); //Debugging line
        const response = await fetch('http://localhost:4000/api/recipes/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`// Added authorization header
            },
            body: JSON.stringify({
                recipeId: recipeId,
                recipeType: recipeType,
                recipeTitle: recipeTitle,
                action: action
            })
        })

        if (!response.ok) {
            throw new Error('Failed to save recipe');
        } else {
            const data = await response.json();
            console.log('Recipe saved:', data);
        }
    }

    useEffect(() => {
        console.log("Updated cardData:", cardData);
        setCards(cardData ?? []);
    }, [cardData]);

    const removeTopCard = () => {
        setCards(prevCards => prevCards.slice(0, -1));
    };

    const likeTopCard = () => {
    setCards(prevCards => {
      if (prevCards.length === 0) return prevCards;

      const topCard = prevCards[prevCards.length - 1];
      saveRecipe(
        topCard._id || topCard.id,
        topCard.recipeType,
        topCard.recipeTitle,
        'liked'
      );

      return prevCards.slice(0, -1);
    });
  };
    return (
        <div className={styles['card-stack']}>
            <div className={styles['card-wrapper']}>
                <img src="/icon-x.png" alt="x" className={styles['icon-x']} onClick={removeTopCard}/>
                {cards.map((card, index) => {
                    return <Card key={card._id || card.id || index}
                    cards = {cards}
                    setCards = {setCards}
                    {...card}
                    index={index} />
                })}
                <img src="/icon-heart.png" alt="heart" className={styles['icon-heart']} onClick={likeTopCard}/>
            </div>
        </div>
    );
};

export default SwipeCards