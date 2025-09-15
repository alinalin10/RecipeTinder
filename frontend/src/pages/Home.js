import React from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

// Put data for cards here (first card = top card)
const cardData = [
    {
        id: 1,
        url: "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2016/10/11/1/FNK_Simple-Homemade-Pancakes_s4x3.jpg.rend.hgtvcom.616.462.suffix/1476216522537.webp",
        name: "Pancakes",
        user: "@user",
        rating: "⭐ 4.5",
        date: "September 10, 2025",
        recipe: "#",
    },
    {
        id: 2,
        url: "https://joyfoodsunshine.com/wp-content/uploads/2018/02/best-chocolate-chip-cookies-recipe-4.jpg",
        name: "Cookies",
        user: "@user",
        rating: "⭐ 5.0",
        date: "September 10, 2025",
        recipe: "#",
    },
]

// Returns the stack of cards and all their data
const SwipeCards = () => {
    return (
        <div
            className="card-stack"
        >
            {cardData.map((card, index) => {
                return <Card key={card.id} {...card} index={index} />
            })}
        </div>
    );
};

// Creates card component (id = place on stack, url = image, name = food, user = uploader, rating = rating, date = date uploaded, recipe = link to recipe, index = used to organize stack)
const Card = ({ id, url, name, user, rating, date, recipe, index }) => {
    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])


    // Contains all card info
    return <motion.div
        className='card'
        style={{ zIndex: cardData.length - index, x, opacity, rotate }}
        drag="x"
        dragConstraints={{
            left: 0,
            right: 0,
        }}
    >
        <img src={url} alt={name} className="card-image"/>
        <div className="card-content">
            <h1 className="recipe-name">{name}</h1>
            <div className="same-row">
                <h2>{user}</h2>
                <h2>{rating}</h2>
            </div>
            <div className="same-row">
                <p>{date}</p>
                <a href={recipe} className="recipe-link">View Recipe</a>
            </div>
        </div>
    </motion.div>
}

export default SwipeCards