require('dotenv').config();
const mongoose = require('mongoose');
const UserRecipes = require('./models/User-Recipes');

const dummyRecipes = [
  {
    title: "Classic Margherita Pizza",
    user: "foodlover123",
    course: "Main Course",
    servings: 4,
    description: "A simple and delicious homemade pizza with fresh mozzarella, basil, and tomato sauce",
    prepTime: 20,
    cookTime: 15,
    calories: 250,
    cuisine: "Italian",
    difficulty: 2,
    steps: [
      "Preheat oven to 475°F (245°C)",
      "Roll out pizza dough on a floured surface",
      "Spread tomato sauce evenly over the dough",
      "Add sliced mozzarella cheese",
      "Bake for 12-15 minutes until crust is golden",
      "Top with fresh basil leaves and serve"
    ],
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    ingredients: [
      "1 pizza dough",
      "1 cup tomato sauce",
      "8 oz fresh mozzarella",
      "Fresh basil leaves",
      "2 tbsp olive oil",
      "Salt to taste"
    ]
  },
  {
    title: "Creamy Chicken Alfredo",
    user: "chefmike",
    course: "Main Course",
    servings: 6,
    description: "Rich and creamy pasta dish with tender chicken and parmesan cheese",
    prepTime: 15,
    cookTime: 25,
    calories: 520,
    cuisine: "Italian",
    difficulty: 2,
    steps: [
      "Cook fettuccine according to package directions",
      "Season chicken breasts with salt and pepper, then cook until golden",
      "Slice chicken into strips",
      "In the same pan, melt butter and add garlic",
      "Add heavy cream and bring to a simmer",
      "Stir in parmesan cheese until melted",
      "Toss pasta with sauce and top with chicken"
    ],
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800",
    ingredients: [
      "1 lb fettuccine pasta",
      "2 chicken breasts",
      "2 cups heavy cream",
      "1 cup parmesan cheese",
      "4 cloves garlic, minced",
      "4 tbsp butter",
      "Salt and pepper to taste",
      "Fresh parsley for garnish"
    ]
  },
  {
    title: "Spicy Thai Basil Chicken",
    user: "asiancuisine101",
    course: "Main Course",
    servings: 4,
    description: "Quick and flavorful stir-fry with ground chicken, Thai basil, and chilies",
    prepTime: 10,
    cookTime: 12,
    calories: 320,
    cuisine: "Thai",
    difficulty: 1,
    steps: [
      "Heat oil in a wok over high heat",
      "Add garlic and chilies, stir-fry for 30 seconds",
      "Add ground chicken and cook until no longer pink",
      "Add soy sauce, fish sauce, and sugar",
      "Stir in Thai basil leaves until wilted",
      "Serve over steamed rice"
    ],
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800",
    ingredients: [
      "1 lb ground chicken",
      "1 cup Thai basil leaves",
      "4 Thai chilies, sliced",
      "6 cloves garlic, minced",
      "2 tbsp soy sauce",
      "1 tbsp fish sauce",
      "1 tsp sugar",
      "2 tbsp vegetable oil"
    ]
  },
  {
    title: "Vegan Buddha Bowl",
    user: "healthyeats",
    course: "Main Course",
    servings: 2,
    description: "Nutritious bowl with quinoa, roasted vegetables, and tahini dressing",
    prepTime: 15,
    cookTime: 30,
    calories: 380,
    cuisine: "Mediterranean",
    difficulty: 1,
    steps: [
      "Cook quinoa according to package instructions",
      "Toss chickpeas and vegetables with olive oil and spices",
      "Roast vegetables at 400°F for 25-30 minutes",
      "Make tahini dressing by whisking tahini, lemon juice, and water",
      "Arrange quinoa, roasted vegetables, and chickpeas in bowls",
      "Drizzle with tahini dressing and top with seeds"
    ],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    ingredients: [
      "1 cup quinoa",
      "1 can chickpeas, drained",
      "1 sweet potato, cubed",
      "1 cup broccoli florets",
      "1/4 cup tahini",
      "2 tbsp lemon juice",
      "2 cups kale, chopped",
      "2 tbsp olive oil",
      "Pumpkin seeds for topping"
    ]
  },
  {
    title: "Classic Chocolate Chip Cookies",
    user: "sweetooth",
    course: "Dessert",
    servings: 24,
    description: "Soft and chewy cookies loaded with chocolate chips",
    prepTime: 15,
    cookTime: 12,
    calories: 180,
    cuisine: "American",
    difficulty: 1,
    steps: [
      "Preheat oven to 350°F (175°C)",
      "Cream together butter and sugars until fluffy",
      "Beat in eggs and vanilla",
      "Mix in flour, baking soda, and salt",
      "Fold in chocolate chips",
      "Drop spoonfuls onto baking sheet",
      "Bake for 10-12 minutes until edges are golden"
    ],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800",
    ingredients: [
      "2 1/4 cups all-purpose flour",
      "1 cup butter, softened",
      "3/4 cup granulated sugar",
      "3/4 cup brown sugar",
      "2 eggs",
      "2 tsp vanilla extract",
      "1 tsp baking soda",
      "1 tsp salt",
      "2 cups chocolate chips"
    ]
  },
  {
    title: "Avocado Toast with Poached Egg",
    user: "brunchmaster",
    course: "Breakfast",
    servings: 2,
    description: "Trendy breakfast with creamy avocado and perfectly poached eggs",
    prepTime: 10,
    cookTime: 5,
    calories: 280,
    cuisine: "American",
    difficulty: 2,
    steps: [
      "Toast bread until golden and crispy",
      "Bring a pot of water to a gentle simmer",
      "Crack eggs into water and poach for 3-4 minutes",
      "Mash avocado with lemon juice, salt, and pepper",
      "Spread avocado mixture on toast",
      "Top with poached egg and season with red pepper flakes"
    ],
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "2 eggs",
      "1 tbsp lemon juice",
      "Red pepper flakes",
      "Salt and pepper to taste",
      "Fresh herbs for garnish"
    ]
  },
  {
    title: "Japanese Ramen Bowl",
    user: "ramenking",
    course: "Main Course",
    servings: 4,
    description: "Hearty ramen with rich broth, noodles, and traditional toppings",
    prepTime: 20,
    cookTime: 40,
    calories: 450,
    cuisine: "Japanese",
    difficulty: 3,
    steps: [
      "Prepare broth by simmering chicken bones with ginger and garlic",
      "Cook ramen noodles according to package",
      "Marinate soft-boiled eggs in soy sauce mixture",
      "Slice and cook pork belly until crispy",
      "Blanch bok choy",
      "Assemble bowls with noodles, broth, and toppings",
      "Garnish with green onions and nori"
    ],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    ingredients: [
      "4 packs ramen noodles",
      "6 cups chicken broth",
      "1 lb pork belly",
      "4 soft-boiled eggs",
      "2 bunches bok choy",
      "4 green onions, sliced",
      "Nori sheets",
      "2 tbsp miso paste",
      "2 tbsp soy sauce",
      "Fresh ginger and garlic"
    ]
  },
  {
    title: "Mediterranean Quinoa Salad",
    user: "healthyeats",
    course: "Salad",
    servings: 6,
    description: "Fresh and colorful salad with Mediterranean flavors",
    prepTime: 15,
    cookTime: 15,
    calories: 220,
    cuisine: "Mediterranean",
    difficulty: 1,
    steps: [
      "Cook quinoa and let cool",
      "Dice cucumber, tomatoes, and red onion",
      "Crumble feta cheese",
      "Whisk together olive oil, lemon juice, and herbs",
      "Combine all ingredients in a large bowl",
      "Toss with dressing and refrigerate before serving"
    ],
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800",
    ingredients: [
      "1 1/2 cups quinoa",
      "1 cucumber, diced",
      "2 cups cherry tomatoes, halved",
      "1/2 red onion, diced",
      "1 cup feta cheese",
      "1/2 cup kalamata olives",
      "1/4 cup olive oil",
      "2 tbsp lemon juice",
      "Fresh parsley and mint"
    ]
  },
  {
    title: "Homemade Beef Tacos",
    user: "texmexfan",
    course: "Main Course",
    servings: 4,
    description: "Flavorful ground beef tacos with fresh toppings",
    prepTime: 10,
    cookTime: 15,
    calories: 340,
    cuisine: "Mexican",
    difficulty: 1,
    steps: [
      "Brown ground beef in a skillet",
      "Add taco seasoning and water, simmer until thickened",
      "Warm taco shells in oven",
      "Dice tomatoes, onions, and lettuce",
      "Grate cheese",
      "Assemble tacos with meat and desired toppings"
    ],
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800",
    ingredients: [
      "1 lb ground beef",
      "8 taco shells",
      "2 tbsp taco seasoning",
      "1 cup shredded cheese",
      "1 cup lettuce, shredded",
      "1 tomato, diced",
      "1/2 onion, diced",
      "Sour cream",
      "Salsa"
    ]
  },
  {
    title: "Blueberry Pancakes",
    user: "breakfastclub",
    course: "Breakfast",
    servings: 4,
    description: "Fluffy pancakes bursting with fresh blueberries",
    prepTime: 10,
    cookTime: 15,
    calories: 320,
    cuisine: "American",
    difficulty: 1,
    steps: [
      "Mix flour, sugar, baking powder, and salt",
      "In another bowl, whisk milk, egg, and melted butter",
      "Combine wet and dry ingredients until just mixed",
      "Fold in blueberries gently",
      "Heat griddle and pour 1/4 cup batter per pancake",
      "Cook until bubbles form, flip and cook until golden",
      "Serve with maple syrup and butter"
    ],
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    ingredients: [
      "2 cups all-purpose flour",
      "2 tbsp sugar",
      "2 tsp baking powder",
      "1/2 tsp salt",
      "1 3/4 cups milk",
      "1 egg",
      "4 tbsp butter, melted",
      "1 cup fresh blueberries",
      "Maple syrup for serving"
    ]
  },
  {
    title: "Chicken Caesar Salad",
    user: "saladdays",
    course: "Salad",
    servings: 4,
    description: "Classic Caesar salad with grilled chicken and homemade dressing",
    prepTime: 15,
    cookTime: 12,
    calories: 380,
    cuisine: "American",
    difficulty: 2,
    steps: [
      "Season and grill chicken breasts until cooked through",
      "Make dressing by whisking mayo, parmesan, lemon, and garlic",
      "Chop romaine lettuce into bite-sized pieces",
      "Toast bread cubes for croutons",
      "Slice grilled chicken",
      "Toss lettuce with dressing, top with chicken and croutons",
      "Garnish with extra parmesan"
    ],
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800",
    ingredients: [
      "2 chicken breasts",
      "1 large head romaine lettuce",
      "1/2 cup mayonnaise",
      "1/4 cup parmesan cheese, grated",
      "2 tbsp lemon juice",
      "2 cloves garlic, minced",
      "2 cups croutons",
      "Olive oil",
      "Salt and pepper"
    ]
  },
  {
    title: "Vegetable Stir Fry",
    user: "veggiemama",
    course: "Main Course",
    servings: 4,
    description: "Colorful mix of vegetables in a savory sauce",
    prepTime: 15,
    cookTime: 10,
    calories: 180,
    cuisine: "Asian",
    difficulty: 1,
    steps: [
      "Cut all vegetables into uniform pieces",
      "Heat wok or large pan over high heat",
      "Add oil and stir-fry harder vegetables first",
      "Add softer vegetables and continue cooking",
      "Mix sauce ingredients together",
      "Pour sauce over vegetables and toss to coat",
      "Serve over rice or noodles"
    ],
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800",
    ingredients: [
      "1 bell pepper, sliced",
      "1 cup broccoli florets",
      "1 carrot, sliced",
      "1 cup snap peas",
      "1 zucchini, sliced",
      "3 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tsp fresh ginger",
      "2 tbsp vegetable oil"
    ]
  },
  {
    title: "Tiramisu",
    user: "sweetooth",
    course: "Dessert",
    servings: 8,
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
    prepTime: 30,
    cookTime: 0,
    calories: 450,
    cuisine: "Italian",
    difficulty: 3,
    steps: [
      "Beat egg yolks with sugar until thick and pale",
      "Fold in mascarpone cheese until smooth",
      "Whip cream to stiff peaks and fold into mixture",
      "Brew strong coffee and let cool",
      "Dip ladyfingers quickly in coffee",
      "Layer coffee-soaked ladyfingers in dish",
      "Spread mascarpone mixture over ladyfingers",
      "Repeat layers and dust with cocoa powder",
      "Refrigerate for at least 4 hours"
    ],
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
    ingredients: [
      "6 egg yolks",
      "3/4 cup sugar",
      "1 1/3 cups mascarpone cheese",
      "2 cups heavy cream",
      "2 cups strong espresso, cooled",
      "3 tbsp coffee liqueur",
      "2 packages ladyfinger cookies",
      "Cocoa powder for dusting"
    ]
  },
  {
    title: "Chicken Tikka Masala",
    user: "currylover",
    course: "Main Course",
    servings: 6,
    description: "Creamy and aromatic Indian curry with tender chicken",
    prepTime: 20,
    cookTime: 30,
    calories: 420,
    cuisine: "Indian",
    difficulty: 2,
    steps: [
      "Marinate chicken in yogurt and spices for 30 minutes",
      "Grill or pan-fry chicken until charred",
      "Sauté onions, garlic, and ginger until soft",
      "Add tomato paste and spices, cook until fragrant",
      "Stir in tomato sauce and simmer",
      "Add cream and cooked chicken",
      "Simmer until sauce thickens",
      "Garnish with cilantro and serve with rice or naan"
    ],
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800",
    ingredients: [
      "2 lbs chicken breast, cubed",
      "1 cup yogurt",
      "1 onion, diced",
      "4 cloves garlic",
      "2 tbsp ginger, minced",
      "2 tbsp garam masala",
      "1 tbsp cumin",
      "1 can tomato sauce",
      "1 cup heavy cream",
      "Fresh cilantro"
    ]
  },
  {
    title: "French Onion Soup",
    user: "soupseason",
    course: "Soup",
    servings: 6,
    description: "Rich and savory soup with caramelized onions and melted cheese",
    prepTime: 15,
    cookTime: 60,
    calories: 320,
    cuisine: "French",
    difficulty: 2,
    steps: [
      "Slice onions thinly",
      "Cook onions slowly in butter until deeply caramelized",
      "Add flour and stir to coat onions",
      "Pour in beef broth and wine, bring to boil",
      "Simmer for 30 minutes",
      "Toast bread slices",
      "Ladle soup into oven-safe bowls",
      "Top with bread and gruyere cheese",
      "Broil until cheese is bubbly and golden"
    ],
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    ingredients: [
      "6 large onions, sliced",
      "4 tbsp butter",
      "2 tbsp flour",
      "6 cups beef broth",
      "1 cup white wine",
      "1 baguette, sliced",
      "2 cups gruyere cheese, grated",
      "Fresh thyme",
      "Salt and pepper"
    ]
  }
];

async function seedRecipes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes (optional - comment out if you want to keep existing ones)
    // await UserRecipes.deleteMany({});
    // console.log('Cleared existing recipes');

    // Insert dummy recipes
    const result = await UserRecipes.insertMany(dummyRecipes);
    console.log(`Successfully added ${result.length} recipes to the database!`);

    // Display summary
    console.log('\nRecipes added:');
    result.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} by ${recipe.user}`);
    });

  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedRecipes();
