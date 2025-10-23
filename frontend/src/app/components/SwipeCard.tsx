"use client";

import React, { useState, useEffect } from 'react'
import Card from './Card'
import styles from './swipeCards.module.css';


// Returns the stack of cards and all their data
const SwipeCards = ({ cardData }: { cardData: any[] }) => {
    const [cards, setCards] = useState(cardData ?? []);

    useEffect(() => {
        console.log("Updated cardData:", cardData);
        setCards(cardData ?? []);
    }, [cardData]);

    const removeTopCard = () => {
        setCards(prevCards => prevCards.slice(0, -1));
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
                <img src="/icon-heart.png" alt="heart" className={styles['icon-heart']} onClick={removeTopCard}/>
            </div>
        </div>
    );
};

export default SwipeCards