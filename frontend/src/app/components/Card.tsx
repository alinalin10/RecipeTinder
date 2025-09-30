import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import styles from './swipeCards.module.css';

export interface CardData {
  id?: number | string;
  _id?: string;
  url?: string;
  image?: string;
  name?: string;
  title?: string;
  user?: string;
  rating?: string;
  difficulty?: string;
  date?: string;
  time?: string;
  recipe?: string;
  recipeType?: string;
  fullRecipeData?: any;
}

interface CardProps {
  id?: number | string;
  _id?: string;
  url?: string;
  image?: string;
  cards: CardData[];
  setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
  name?: string;
  title?: string;
  user?: string;
  rating?: string;
  difficulty?: string;
  date?: string;
  time?: string;
  recipe?: string;
  recipeType?: string;
  index: number;
  fullRecipeData?: any;
}

// Creates card component (id = place on stack, url/image = image, name/title = food, user = uploader, rating = rating, date = date uploaded, recipe = link to recipe, index = used to organize stack)
const Card = ({ id, _id, url, image, cards, setCards, name, title, user, rating, difficulty, date, time, recipe, recipeType = 'userMade', index, fullRecipeData }: CardProps) => {
    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])

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

    // Front card disappears when dragged and let go
    const handleDragEnd = async () => {
        const currentX = x.get();
        if (Math.abs(currentX) > 150) {
            const direction = currentX > 0 ? 1 : -1;

            animate(x, direction * 600, {
                type: 'spring',
                stiffness: 200,
                damping: 25,
                onComplete: () => {
                    setCards((prev: CardData[]) => prev.filter((v: CardData) => (v.id || v._id) !== (id || _id)));
                }
            });

            if (direction === 1) {
                await saveRecipe(id, recipeType, name, 'liked');
            }
        } else {
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
        }
    }

    const imageUrl = url || image;
    const recipeName = name || title;
    const cardId = id || _id;

    // Contains all card info
    return <motion.div
        className={styles['card']}
        style={{ x, opacity, rotate }}
        drag="x"
        dragConstraints={{
            left: 0,
            right: 0,
        }}
        onDragEnd={handleDragEnd}
    >
        <img src={imageUrl} alt={recipeName} className={styles['card-image']}/>
        <div className={styles['card-content']}>
            <h1 className={styles['recipe-name']}>{recipeName}</h1>
            <div className={styles['same-row']}>
                <h2>{"@" + (user || "user")}</h2>
                <h2>{rating || "⭐ 5.0"}</h2>
            </div>
            <div className={styles['same-row']}>
                <p>{time || date || "October 23, 2025"}</p>
                <a href={recipe || "/recipe-description/" + cardId} className={styles['recipe-link']}>View Recipe</a>
            </div>
        </div>
    </motion.div>
}

export default Card
export type { CardData }
