'use client';
import { useState } from 'react';

export type Recipe = {
  id: number;
  title: string;
  image: string;
};

export function useRecipes() {
  const [recipes] = useState<Recipe[]>([
    { id: 1, title: "Fluffy Berry Pancakes", image: "/pancakes.png" },
    { id: 2, title: "Ultimate Veggie BLT", image: "/blt.jpg" },
    { id: 3, title: "Chicken Lasagna", image: "/lasagna.jpg" },
    { id: 4, title: "Strawberry Pie", image: "/pie.jpg" },
    { id: 5, title: "Sweet Potato Salad", image: "/salad.jpg" },
    { id: 6, title: "Cherry Macarons", image: "/macarons.jpg" },
  ]);

  return { recipes };
}