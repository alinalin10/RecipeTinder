"use client";

import React, { useState, useEffect } from 'react'
import Card, { type CardData } from './Card'
import styles from './swipeCards.module.css'
import { useRouter } from 'next/navigation'


// Returns the stack of cards and all their data
const SwipeCards = ({ cardData, onCardsEmpty }: { cardData: CardData[], onCardsEmpty?: () => void }) => {
    const [cards, setCards] = useState<CardData[]>(cardData ?? []);

    const router = useRouter();
    // check for token presence
    const hasAuthToken = () => {
        try {
            const userJson = localStorage.getItem('user');
            return !!(userJson && JSON.parse(userJson).token);
        } catch (error) {
            return false;
        }
    }



      const saveRecipe = async (recipeId: number | string, recipeType: string, recipeTitle: string, action: string) => {
        // Get the user object from localStorage and extract the token
        const userJson = localStorage.getItem('user');
        const token = userJson ? JSON.parse(userJson).token : null;

        if (!token) {
            // no token — do not call backend
            console.warn('saveRecipe called without token')
            return
        }


        console.log('Token value:', token); // ADD THIS
        console.log('Token length:', token?.length); // ADD THIS

        console.log('Token exists:', !!token); //Debugging line
        const response = await fetch('http://localhost:4000/api/swipe/save', {
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

    // Detect when cards run out and trigger refresh
    useEffect(() => {
        if (cards.length === 0 && cardData.length === 0 && onCardsEmpty) {
            console.log("No more cards - triggering auto-refresh");
            onCardsEmpty();
        }
    }, [cards.length, cardData.length, onCardsEmpty]);

    const removeTopCard = () => {
        setCards(prevCards => prevCards.slice(0, -1));
    };

    const likeTopCard = () => {
        if (!hasAuthToken()) {
            router.push('/login')
            return
        }
        setCards(prevCards => {
        if (prevCards.length === 0) return prevCards;

        const topCard = prevCards[prevCards.length - 1];
        const recipeId = topCard._id || topCard.id;
        const recipeTitle = topCard.name || topCard.title;

        if (recipeId && recipeTitle) {
            saveRecipe(
            recipeId,
            topCard.recipeType || 'userMade',
            recipeTitle,
            'liked'
            );
        }

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