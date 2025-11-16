'use client'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Link from 'next/link'
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
    console.log('Card rendered with:', { 
        id, 
        _id, 
        idType: typeof id, 
        _idType: typeof _id,
        match: id || _id 
    });
    console.log('📋 Card props:', { id, _id, name, title, recipeType, fullRecipeData }); // Add this line
    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])

    const router = useRouter()

    const saveRecipe = async (recipeId: number | string, recipeType: string, recipeTitle: string, action: string) => {
        // token is stored inside localStorage.user as a JSON string { token: '...', ... }
        let token: string | null = null
        try {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const userObj = JSON.parse(userStr)
                token = userObj?.token || null
            }
        } catch (e) {
            console.warn('Failed to parse stored user object', e)
        }

        console.log('Attempting to save recipe:', { recipeId, recipeType, recipeTitle, action })
        console.log('Token exists:', !!token)

        if (!token) {
            // If user is not authenticated, send them to signup/login instead of attempting the API call
            console.info('User not authenticated — redirecting to /signup')
            router.push('/signup')
            return
        }

        const response = await fetch('http://localhost:4000/api/swipe/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                recipeId: recipeId,
                recipeType: recipeType,
                recipeTitle: recipeTitle,
                action: action
            })
        })

        let data: any = {}
        try {
            data = await response.json()
        } catch (err) {
            // response had no JSON body
            data = {}
        }

        if (!response.ok) {
            console.error('Failed to save recipe:', response.status, data)
            throw new Error(`Failed to save recipe: ${data.error || response.statusText}`)
        }

        console.log('Recipe saved successfully:', data)
    }

    // Front card disappears when dragged and let go
    const handleDragEnd = async () => {
        console.log('Current cards length:', cards.length);
        const currentX = x.get();
        console.log('🔥 DRAG ENDED! Position:', currentX);
        if (Math.abs(currentX) > 150) {
            console.log('✅ Swipe threshold reached!');
            const direction = currentX > 0 ? 1 : -1;
            console.log('Direction:', direction > 0 ? '👍 RIGHT (LIKE)' : '👎 LEFT (DISLIKE)'); // Add this

            animate(x, direction * 600, {
                type: 'spring',
                stiffness: 500,
                damping: 15,
                onComplete: () => {
                    console.log('Trying to remove card with id:', id || _id);
                    setCards((prev: CardData[]) => prev.slice(0, -1));
                }
            });

            if (direction === 1) {
                console.log('🎯 Right swipe detected, attempting to save...'); // Add this
                const recipeId = id || _id || fullRecipeData?.id;
                const recipeTitle = name || title;
                console.log('Recipe details:', { recipeId, recipeTitle, recipeType }); // Add this
                if (recipeId && recipeTitle) {
                    console.log('✅ Recipe ID and title exist, calling saveRecipe...'); // Add this
                    try {
                        await saveRecipe(recipeId, recipeType, recipeTitle, 'liked');
                    } catch (err) {
                        // Don't crash the UI if saving fails. Log and optionally show a toast in the future.
                        console.error('saveRecipe failed', err);
                    }
                }
                else {
                    console.log('❌ Missing recipe ID or title'); // Add this
                }
            }
        } else {
            console.log('❌ Not far enough, returning to center'); // Add this
            animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
        }
    }

    const imageUrl = url || image || 'https://img.freepik.com/premium-photo/cutting-board-with-knife-knife-it_865967-240613.jpg';
    const recipeName = name || title;
    const cardId = id || _id;

    // Determine if this is an external URL (Spoonacular) or internal (user recipe)
    const isExternalRecipe = recipeType === 'spoonacular';
    const recipeUrl = recipe || `/recipe-description/${cardId}`;

    // Contains all card info
    // Only show the top card (last in array) and allow dragging only on top card
    const isTopCard = index === cards.length - 1;

    return <motion.div
        className={styles['card']}
        style={{
            x,
            opacity: isTopCard ? opacity : 1,
            rotate,
            zIndex: index,
            pointerEvents: isTopCard ? 'auto' : 'none'
        }}
        drag={isTopCard ? "x" : false}
        dragConstraints={{
            left: 0,
            right: 0,
        }}
        onDragEnd={handleDragEnd}
    >
        <img src={imageUrl} alt={recipeName} className={styles['card-image']} />
        <div className={styles['card-content']}>
            <h1 className={styles['recipe-name']}>{recipeName}</h1>
            <div className={styles['same-row']}>
                <h2>{"@" + (user || "user")}</h2>
                <h2>{rating || "⭐ 5.0"}</h2>
            </div>
            <div className={styles['same-row']}>
                <p>{time || date || "October 23, 2025"}</p>
                {isExternalRecipe ? (
                    <a
                        href={recipeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles['recipe-link']}
                    >
                        View Recipe ↗
                    </a>
                ) : (
                    <Link href={recipeUrl} className={styles['recipe-link']}>
                        View Recipe
                    </Link>
                )}
            </div>
        </div>
    </motion.div>
}

export default Card

