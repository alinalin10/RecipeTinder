import SwipeCards from '../../components/SwipeCard';

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

const SwipeInterface = () => {
    return (
        <SwipeCards cardData={cardData} />
    );
};

export default SwipeInterface