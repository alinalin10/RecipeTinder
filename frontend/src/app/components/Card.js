import { motion, useMotionValue, useTransform } from 'framer-motion'
import styles from './swipeCards.module.css';

// Creates card component (id = place on stack, url = image, name = food, user = uploader, rating = rating, date = date uploaded, recipe = link to recipe, index = used to organize stack, fullRecipeData = complete recipe information)
const Card = ({ id, url, cards, setCards, name, user, rating, date, recipe, index, fullRecipeData }) => {
    // As card moves left and right it rotates sideways and also starts to disappear
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-250, 0, 250], [0, 1, 0])
    const rotate = useTransform(x, [-250, 250], [-18, 18])

    // Front card disappears when dragged and let go
    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 150) {
            // Get rid of front card when dragged
            setCards(pv => pv.filter(v => v.id !== id))
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
        <img src={url} alt={name} className={styles['card-image']}/>
        <div className={styles['card-content']}>
            <h1 className={styles['recipe-name']}>{name}</h1>
            <div className={styles['same-row']}>
                <h2>{user}</h2>
                <h2>{rating}</h2>
            </div>
            <div className={styles['same-row']}>
                <p>{date}</p>
                <a href={recipe} className={styles['recipe-link']}>View Recipe</a>
            </div>
        </div>
    </motion.div>
}

export default Card