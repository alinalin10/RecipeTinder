import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import styles from './swipeCards.module.css';

// Creates card component (id = place on stack, image = image, name = food, user = uploader, rating = rating, date = date uploaded, recipe = link to recipe, index = used to organize stack)
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
  date,
  recipe,
  index
}: {
  id: number | string,
  image: string,
  cards: any[],
  setCards: React.Dispatch<React.SetStateAction<any[]>>,
  name?: string,
  title?: string,
  user?: string,
  rating?: string,
  difficulty?: string,
  date?: string,
  recipe?: string,
  index: number
}) => {

    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])

    // Front card disappears when dragged and let go
    const handleDragEnd = () => {
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
            <h2>{user || "@user"}</h2>
            <h2>{rating || "⭐ 5.0"}</h2>
            </div>
            <div className={styles['same-row']}>
            <p>{date || "October 23, 2025"}</p>
            <a href={recipe || "/recipe-description/" + id} className={styles['recipe-link']}>View Recipe</a>
            </div>
        </div>
    </motion.div>
}

export default Card