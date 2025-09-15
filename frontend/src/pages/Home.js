import React from 'react'

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

const Card = ({ id, url, name, user, rating, date, recipe, index }) => {
    return <div className='card' style={{ zIndex: cardData.length - index }}>
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
    </div>
}

export default SwipeCards

/*<h1>{name}</h1>
<h2>{user}</h2>
<h2>{rating}</h2>
<p>{date}</p>
<a href={recipe}>View Recipe</a>*/