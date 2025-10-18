'use client';

import SwipeCards from '../components/SwipeCard';
import { useRecipesInfoContext } from '../../../hooks/useRecipesContext';

export default function Home() {
  const { recipes } = useRecipesInfoContext()

  return (
    <SwipeCards cardData={recipes} />
  );
}
