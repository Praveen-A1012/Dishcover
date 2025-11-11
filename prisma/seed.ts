import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.recipe.deleteMany({});
  console.log("🧹 Cleared old recipes...");

  const recipeData = [
  // 🥗 VEGETARIAN
  {
    title: "Margherita Pizza",
    description: "Classic Italian pizza with mozzarella, tomato, and basil.",
    diet: "Vegetarian",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    ingredients: [
      { name: "Pizza dough", quantity: "1 base" },
      { name: "Tomato sauce", quantity: "1/2 cup" },
      { name: "Mozzarella cheese", quantity: "1/2 cup" },
      { name: "Fresh basil leaves", quantity: "5-6" },
      { name: "Olive oil", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Preheat oven to 450°F (230°C)." },
      { step: 2, description: "Spread tomato sauce over pizza base." },
      { step: 3, description: "Top with mozzarella and basil leaves." },
      { step: 4, description: "Drizzle olive oil and bake for 10–12 minutes." },
    ],
    chefTips: [
      "Use fresh mozzarella for better melt.",
      "Add chili flakes for a spicy kick.",
    ],
  },
  {
    title: "Paneer Butter Masala",
    description: "Rich and creamy Indian cottage cheese curry.",
    diet: "Vegetarian",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    ingredients: [
      { name: "Paneer", quantity: "200g" },
      { name: "Tomato puree", quantity: "1 cup" },
      { name: "Butter", quantity: "2 tbsp" },
      { name: "Cream", quantity: "2 tbsp" },
      { name: "Spices", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté onions and spices in butter." },
      { step: 2, description: "Add tomato puree and cook 10 minutes." },
      { step: 3, description: "Add paneer cubes and simmer for 5 minutes." },
      { step: 4, description: "Finish with cream and garnish with coriander." },
    ],
    chefTips: ["Use Kashmiri chili powder for vibrant color."],
  },
  {
    title: "Greek Salad",
    description: "Refreshing salad with feta, olives, and vegetables.",
    diet: "Vegetarian",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    ingredients: [
      { name: "Cucumber", quantity: "1 cup, chopped" },
      { name: "Tomato", quantity: "1 cup, chopped" },
      { name: "Red onion", quantity: "1/4 cup, sliced" },
      { name: "Feta cheese", quantity: "1/4 cup, crumbled" },
      { name: "Olives", quantity: "1/4 cup" },
    ],
    instructions: [
      { step: 1, description: "Combine all vegetables in a bowl." },
      { step: 2, description: "Add feta and olives." },
      { step: 3, description: "Drizzle with olive oil and season with salt." },
    ],
    chefTips: ["Chill before serving for best flavor."],
  },

  // 🌱 VEGAN
  {
    title: "Vegan Buddha Bowl",
    description: "Nutritious bowl with quinoa, chickpeas, and vegetables.",
    diet: "Vegan",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Quinoa", quantity: "1 cup" },
      { name: "Chickpeas", quantity: "1 cup" },
      { name: "Broccoli", quantity: "1 cup" },
      { name: "Sweet potato", quantity: "1" },
      { name: "Tahini dressing", quantity: "2 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Cook quinoa until fluffy." },
      { step: 2, description: "Roast broccoli and sweet potato." },
      { step: 3, description: "Combine all with chickpeas and drizzle tahini." },
    ],
    chefTips: ["Add avocado slices for extra creaminess."],
  },
  {
    title: "Tofu Stir Fry",
    description: "Quick stir-fry with tofu, bell peppers, and soy sauce.",
    diet: "Vegan",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "Tofu", quantity: "200g, cubed" },
      { name: "Bell peppers", quantity: "1 cup, sliced" },
      { name: "Soy sauce", quantity: "2 tbsp" },
      { name: "Garlic", quantity: "2 cloves" },
      { name: "Sesame oil", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté tofu until golden brown." },
      { step: 2, description: "Add garlic, vegetables, and soy sauce." },
      { step: 3, description: "Stir-fry for 5–6 minutes." },
    ],
    chefTips: ["Use firm tofu to keep texture during cooking."],
  },
  {
    title: "Lentil Soup",
    description: "Warm, hearty lentil soup packed with protein.",
    diet: "Vegan",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    ingredients: [
      { name: "Lentils", quantity: "1 cup" },
      { name: "Carrot", quantity: "1, chopped" },
      { name: "Celery", quantity: "1 stalk, chopped" },
      { name: "Onion", quantity: "1/2, diced" },
      { name: "Vegetable broth", quantity: "4 cups" },
    ],
    instructions: [
      { step: 1, description: "Boil lentils in broth until soft." },
      { step: 2, description: "Add chopped vegetables and simmer." },
      { step: 3, description: "Blend partially for thicker texture." },
    ],
    chefTips: ["Add lemon juice before serving to brighten flavor."],
  },

  // 🐟 PESCATARIAN
  {
    title: "Grilled Salmon",
    description: "Salmon with lemon butter sauce and herbs.",
    diet: "Pescatarian",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "Salmon fillet", quantity: "2 pieces" },
      { name: "Lemon juice", quantity: "1 tbsp" },
      { name: "Olive oil", quantity: "1 tbsp" },
      { name: "Garlic", quantity: "1 clove, minced" },
      { name: "Herbs", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Marinate salmon in lemon juice, oil, and garlic." },
      { step: 2, description: "Grill 6–8 minutes per side." },
      { step: 3, description: "Top with herbs before serving." },
    ],
    chefTips: ["Don’t overcook the salmon; keep it juicy."],
  },
  {
    title: "Shrimp Tacos",
    description: "Soft tortillas filled with grilled shrimp and veggies.",
    diet: "Pescatarian",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    ingredients: [
      { name: "Shrimp", quantity: "200g" },
      { name: "Tortillas", quantity: "6" },
      { name: "Avocado", quantity: "1" },
      { name: "Cabbage slaw", quantity: "1 cup" },
      { name: "Lime", quantity: "1" },
    ],
    instructions: [
      { step: 1, description: "Grill shrimp with spices." },
      { step: 2, description: "Assemble tacos with avocado and slaw." },
      { step: 3, description: "Squeeze lime before serving." },
    ],
    chefTips: ["Add chipotle mayo for smoky flavor."],
  },
  {
    title: "Fish Curry",
    description: "Coconut-based curry with tender white fish.",
    diet: "Pescatarian",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    ingredients: [
      { name: "White fish", quantity: "200g" },
      { name: "Coconut milk", quantity: "1 cup" },
      { name: "Curry paste", quantity: "2 tbsp" },
      { name: "Onion", quantity: "1, sliced" },
      { name: "Oil", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté onion and curry paste." },
      { step: 2, description: "Add fish and coconut milk; simmer 10 mins." },
    ],
    chefTips: ["Use fresh curry leaves for aroma."],
  },

  // 🍗 NON-VEGETARIAN
  {
    title: "Chicken Tikka Masala",
    description: "Creamy spiced curry with grilled chicken pieces.",
    diet: "Non-Vegetarian",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    ingredients: [
      { name: "Chicken breast", quantity: "250g" },
      { name: "Yogurt", quantity: "1/2 cup" },
      { name: "Tomato puree", quantity: "1 cup" },
      { name: "Spices", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Marinate chicken in yogurt and spices." },
      { step: 2, description: "Grill and add to simmering tomato sauce." },
    ],
    chefTips: ["Use smoked paprika for tandoori flavor."],
  },
  {
    title: "Beef Burger",
    description: "Juicy beef patty with cheese, lettuce, and tomato.",
    diet: "Non-Vegetarian",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "Beef patty", quantity: "2" },
      { name: "Burger buns", quantity: "2" },
      { name: "Cheese slice", quantity: "2" },
      { name: "Lettuce", quantity: "2 leaves" },
      { name: "Tomato", quantity: "2 slices" },
    ],
    instructions: [
      { step: 1, description: "Grill patties for 3–4 minutes per side." },
      { step: 2, description: "Assemble burger with cheese and toppings." },
    ],
    chefTips: ["Toast buns for crunch and brush with butter."],
  },

  // 🥑 KETO
  {
    title: "Keto Egg Muffins",
    description: "Egg muffins with cheese and spinach.",
    diet: "Keto",
    recommended: true,
    servings: 4,
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Eggs", quantity: "4" },
      { name: "Spinach", quantity: "1 cup" },
      { name: "Cheddar cheese", quantity: "1/4 cup" },
      { name: "Bacon bits", quantity: "2 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Mix all ingredients in a bowl." },
      { step: 2, description: "Pour into muffin tins and bake at 375°F for 20 minutes." },
    ],
    chefTips: ["Store in fridge for up to 3 days."],
  },
  {
    title: "Zucchini Noodles",
    description: "Low-carb noodles made from zucchini.",
    diet: "Keto",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    ingredients: [
      { name: "Zucchini", quantity: "2" },
      { name: "Pesto", quantity: "2 tbsp" },
      { name: "Parmesan", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Spiralize zucchini." },
      { step: 2, description: "Sauté lightly and toss with pesto." },
    ],
    chefTips: ["Keep zoodles slightly firm for better texture."],
  },

  // 🥩 PALEO
  {
    title: "Paleo Chicken Salad",
    description: "Chicken salad with avocado and paleo mayo.",
    diet: "Paleo",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    ingredients: [
      { name: "Chicken breast", quantity: "200g" },
      { name: "Avocado", quantity: "1" },
      { name: "Paleo mayo", quantity: "2 tbsp" },
      { name: "Lemon juice", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Cook and shred the chicken." },
      { step: 2, description: "Mix with avocado, mayo, and lemon juice." },
    ],
    chefTips: ["Serve on lettuce wraps for a fresh twist."],
  },
  {
    title: "Paleo Meatballs",
    description: "Juicy meatballs without breadcrumbs.",
    diet: "Paleo",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    ingredients: [
      { name: "Ground beef", quantity: "300g" },
      { name: "Egg", quantity: "1" },
      { name: "Herbs", quantity: "1 tbsp" },
      { name: "Garlic", quantity: "2 cloves" },
    ],
    instructions: [
      { step: 1, description: "Mix all ingredients and form into balls." },
      { step: 2, description: "Bake at 375°F for 25 minutes." },
    ],
    chefTips: ["Serve with homemade tomato sauce."],
  },
  // 🌾 GLUTEN-FREE
  {
    title: "Grilled Chicken with Quinoa",
    description: "High-protein meal with grilled chicken and fluffy quinoa.",
    diet: "Gluten-Free",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Chicken breast", quantity: "200g" },
      { name: "Quinoa", quantity: "1 cup" },
      { name: "Olive oil", quantity: "1 tbsp" },
      { name: "Spinach", quantity: "1 cup" },
    ],
    instructions: [
      { step: 1, description: "Cook quinoa until fluffy." },
      { step: 2, description: "Grill chicken until golden brown." },
      { step: 3, description: "Serve chicken over quinoa and spinach." },
    ],
    chefTips: ["Add lemon zest for brightness."],
  },
  {
    title: "Stuffed Bell Peppers",
    description: "Bell peppers stuffed with rice and vegetables.",
    diet: "Gluten-Free",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    ingredients: [
      { name: "Bell peppers", quantity: "3" },
      { name: "Cooked rice", quantity: "1 cup" },
      { name: "Corn", quantity: "1/2 cup" },
      { name: "Black beans", quantity: "1/2 cup" },
    ],
    instructions: [
      { step: 1, description: "Cut tops off peppers and remove seeds." },
      { step: 2, description: "Mix rice, corn, and beans, then stuff peppers." },
      { step: 3, description: "Bake at 375°F for 25 minutes." },
    ],
    chefTips: ["Top with avocado slices before serving."],
  },
  {
    title: "Gluten-Free Pancakes",
    description: "Fluffy pancakes made with almond flour.",
    diet: "Gluten-Free",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    ingredients: [
      { name: "Almond flour", quantity: "1 cup" },
      { name: "Eggs", quantity: "2" },
      { name: "Milk", quantity: "1/2 cup" },
      { name: "Honey", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Mix all ingredients into a smooth batter." },
      { step: 2, description: "Cook pancakes on a non-stick pan until golden." },
    ],
    chefTips: ["Serve with berries and maple syrup."],
  },

  // 🥛 DAIRY-FREE
  {
    title: "Coconut Curry Chicken",
    description: "Creamy coconut milk curry without any dairy.",
    diet: "Dairy-Free",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 25,
    ingredients: [
      { name: "Chicken", quantity: "250g" },
      { name: "Coconut milk", quantity: "1 cup" },
      { name: "Curry paste", quantity: "2 tbsp" },
      { name: "Vegetables", quantity: "1 cup" },
    ],
    instructions: [
      { step: 1, description: "Sauté curry paste and add chicken pieces." },
      { step: 2, description: "Pour in coconut milk and simmer for 15 minutes." },
    ],
    chefTips: ["Use fresh cilantro as garnish."],
  },
  {
    title: "Avocado Smoothie",
    description: "Creamy, dairy-free smoothie with avocado and banana.",
    diet: "Dairy-Free",
    recommended: true,
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    ingredients: [
      { name: "Avocado", quantity: "1/2" },
      { name: "Banana", quantity: "1" },
      { name: "Almond milk", quantity: "1 cup" },
      { name: "Honey", quantity: "1 tbsp" },
    ],
    instructions: [
      { step: 1, description: "Blend all ingredients until smooth." },
      { step: 2, description: "Serve chilled." },
    ],
    chefTips: ["Add ice cubes for a thicker texture."],
  },
  {
    title: "Vegan Mac and Cheese",
    description: "Comforting pasta with creamy cashew sauce.",
    diet: "Dairy-Free",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Gluten-free pasta", quantity: "2 cups" },
      { name: "Cashews", quantity: "1/2 cup" },
      { name: "Nutritional yeast", quantity: "2 tbsp" },
      { name: "Garlic powder", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Blend cashews, yeast, and spices into sauce." },
      { step: 2, description: "Toss cooked pasta with cashew sauce." },
    ],
    chefTips: ["Add sautéed veggies for extra flavor."],
  },

  // 🥩 LOW-CARB
  {
    title: "Cauliflower Fried Rice",
    description: "Low-carb version of fried rice using cauliflower.",
    diet: "Low-Carb",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "Cauliflower rice", quantity: "2 cups" },
      { name: "Eggs", quantity: "2" },
      { name: "Soy sauce", quantity: "2 tbsp" },
      { name: "Peas and carrots", quantity: "1/2 cup" },
    ],
    instructions: [
      { step: 1, description: "Scramble eggs and set aside." },
      { step: 2, description: "Stir-fry cauliflower rice with vegetables." },
      { step: 3, description: "Mix in eggs and soy sauce." },
    ],
    chefTips: ["Add sesame oil for aroma."],
  },
  {
    title: "Zesty Chicken Lettuce Wraps",
    description: "Low-carb chicken wraps with tangy sauce.",
    diet: "Low-Carb",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    ingredients: [
      { name: "Ground chicken", quantity: "200g" },
      { name: "Lettuce leaves", quantity: "8" },
      { name: "Soy sauce", quantity: "2 tbsp" },
      { name: "Ginger", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Cook ground chicken with soy sauce and ginger." },
      { step: 2, description: "Spoon into lettuce leaves and roll up." },
    ],
    chefTips: ["Top with chopped peanuts or green onions."],
  },
  {
    title: "Eggplant Lasagna",
    description: "Lasagna layered with eggplant instead of pasta.",
    diet: "Low-Carb",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    ingredients: [
      { name: "Eggplant", quantity: "2, sliced" },
      { name: "Tomato sauce", quantity: "1 cup" },
      { name: "Mozzarella", quantity: "1/2 cup" },
      { name: "Ground beef", quantity: "200g" },
    ],
    instructions: [
      { step: 1, description: "Layer grilled eggplant, beef, and sauce." },
      { step: 2, description: "Bake at 375°F for 25 minutes." },
    ],
    chefTips: ["Let rest before slicing to set layers."],
  },

  // 🫐 LOW-FAT
  {
    title: "Steamed Fish with Vegetables",
    description: "Light and healthy fish with steamed vegetables.",
    diet: "Low-Fat",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    ingredients: [
      { name: "White fish fillet", quantity: "2" },
      { name: "Broccoli", quantity: "1 cup" },
      { name: "Carrots", quantity: "1 cup" },
      { name: "Lemon", quantity: "1/2" },
    ],
    instructions: [
      { step: 1, description: "Steam fish and vegetables together." },
      { step: 2, description: "Squeeze lemon juice before serving." },
    ],
    chefTips: ["Add herbs like dill or parsley for aroma."],
  },
  {
    title: "Vegetable Soup",
    description: "Light and hearty soup full of fiber and vitamins.",
    diet: "Low-Fat",
    recommended: true,
    servings: 3,
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    ingredients: [
      { name: "Mixed vegetables", quantity: "2 cups" },
      { name: "Vegetable broth", quantity: "4 cups" },
      { name: "Garlic", quantity: "2 cloves" },
      { name: "Herbs", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Sauté garlic and add vegetables." },
      { step: 2, description: "Add broth and simmer for 20 minutes." },
    ],
    chefTips: ["Blend half the soup for creamy texture without fat."],
  },
  {
    title: "Chicken and Brown Rice Bowl",
    description: "Lean chicken with brown rice and vegetables.",
    diet: "Low-Fat",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    ingredients: [
      { name: "Chicken breast", quantity: "200g" },
      { name: "Brown rice", quantity: "1 cup" },
      { name: "Peas", quantity: "1/2 cup" },
      { name: "Carrots", quantity: "1/2 cup" },
    ],
    instructions: [
      { step: 1, description: "Cook rice and chicken separately." },
      { step: 2, description: "Combine with vegetables and season lightly." },
    ],
    chefTips: ["Add a squeeze of lime for freshness."],
  },

  // 🧂 OTHER
  {
    title: "Mixed Veggie Stir Fry",
    description: "Quick stir-fry with seasonal vegetables.",
    diet: "Other",
    recommended: true,
    servings: 2,
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    ingredients: [
      { name: "Mixed vegetables", quantity: "2 cups" },
      { name: "Soy sauce", quantity: "1 tbsp" },
      { name: "Garlic", quantity: "2 cloves" },
      { name: "Ginger", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Stir-fry garlic and ginger in oil." },
      { step: 2, description: "Add vegetables and toss with soy sauce." },
    ],
    chefTips: ["Top with sesame seeds for crunch."],
  },
  {
    title: "Avocado Toast Deluxe",
    description: "Toasted bread topped with smashed avocado and extras.",
    diet: "Other",
    recommended: true,
    servings: 1,
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    ingredients: [
      { name: "Bread slice", quantity: "2" },
      { name: "Avocado", quantity: "1" },
      { name: "Cherry tomatoes", quantity: "4" },
      { name: "Lemon juice", quantity: "1 tsp" },
    ],
    instructions: [
      { step: 1, description: "Toast bread and mash avocado on top." },
      { step: 2, description: "Add sliced tomatoes and drizzle lemon juice." },
    ],
    chefTips: ["Sprinkle chili flakes for a bold touch."],
  },
  {
    title: "Breakfast Smoothie Bowl",
    description: "Colorful fruit bowl topped with granola and seeds.",
    diet: "Other",
    recommended: true,
    servings: 1,
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    ingredients: [
      { name: "Frozen berries", quantity: "1 cup" },
      { name: "Banana", quantity: "1" },
      { name: "Almond milk", quantity: "1/2 cup" },
      { name: "Granola", quantity: "1/4 cup" },
    ],
    instructions: [
      { step: 1, description: "Blend berries, banana, and almond milk." },
      { step: 2, description: "Pour into bowl and top with granola." },
    ],
    chefTips: ["Add chia seeds for extra fiber."],
  },
];


  await prisma.recipe.createMany({ data: recipeData });
  console.log(`✅ Seeded ${recipeData.length} recipes successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
