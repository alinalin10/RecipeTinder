"use client";

import React, { useState } from 'react'
import Card from './Card'
import styles from './swipeCards.module.css';


// Returns the stack of cards and all their data
const SwipeCards = ({ cardData }) => {
    const [cards, setCards] = useState(cardData);
    return (
        <div className={styles['card-stack']}>
            <div className={styles['card-wrapper']}>
                <img src="/icon-x.png" alt="x" className={styles['icon-x']}/>
                {cards.map((card, index) => {
                    return <Card key={card.id}
                    cards = {cards}
                    setCards = {setCards}
                    {...card}
                    index={index} />
                })}
                <img src="/icon-heart.png" alt="heart" className={styles['icon-heart']}/>
            </div>
        </div>
    );
};

export default SwipeCards