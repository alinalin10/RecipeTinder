"use client"
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../../hooks/useAuthContext'
import styles from './swipeCards.module.css';

// Creates card component (id = place on stack, image = image, name = food, user = uploader, rating = rating, time = date uploaded, recipe = link to recipe, index = used to organize stack)
const Card = ({
  id,
  image,
  cards,
  setCards,
  name,
  title,
  user,
  rating,
  difficulty,
  time,
  recipe,
  recipeType = 'userMade', // default to userMade if no type provided
  index
}: {
  id: number | string,
  image: string,
  cards: any[],
  setCards: React.Dispatch<React.SetStateAction<any[]>>,
  name: string,
  title?: string,
  user?: string,
  rating?: string,
  difficulty?: string,
  time?: string,
  recipeType: string,
  recipe?: string,
  index: number
}) => {

    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])

    const router = useRouter()
    const { user: authUser } = useAuthContext()

    const saveRecipe = async (recipeId: number | string, recipeType: string, recipeTitle: string, action: string) => {
        // token is stored inside the user object in localStorage (saved on login/signup)
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null
        const token = stored ? (JSON.parse(stored).token || null) : null

        // if no authenticated user/token, redirect to signup
        if (!authUser || !token) {
            router.push('/signup')
            return
        }

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
            // push error to caller
            const errText = await response.text().catch(() => '')
            throw new Error(`Failed to save recipe: ${response.status} ${errText}`);
        }

        const data = await response.json();
        console.log('Recipe saved:', data);
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
                    setCards(prev => prev.filter(v => (v.id || v._id) !== id));
                }
            });

            if (direction === 1) {
                await saveRecipe(id, recipeType, name, 'liked');
            }
        } else {
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
        }
    }

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
        <img src={image} alt={name} className={styles['card-image']}/>
        <div className={styles['card-content']}>
            <h1 className={styles['recipe-name']}>{name || title}</h1>
            <div className={styles['same-row']}>
            <h2>{"@" + user || "@user"}</h2>
            <h2>{rating || "⭐ 5.0"}</h2>
            </div>
            <div className={styles['same-row']}>
            <p>{time}</p>
            <a href={recipe || "/recipe-description/" + id} className={styles['recipe-link']}>View Recipe</a>
            </div>
        </div>
    </motion.div>
}

export default Card