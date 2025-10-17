'use client';

import { RecipesProvider } from '../../context/RecipesContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecipesProvider>
      {children}
    </RecipesProvider>
  );
}