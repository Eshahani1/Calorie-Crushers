import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface FoodItem {
  id: number; // Unique identifier for each food item
  label: string;
  cal: number;
  fat: number;
  protein: number;
  carbohydrates: number;
  brand: string;
}

interface CalorieContextProps {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  recentlyAddedFoods: FoodItem[];
  addNutrients: (cal: number, protein: number, fat: number, carbs: number) => void;
  addRecentlyAddedFood: (food: Omit<FoodItem, 'id'>) => void; // Omit id when adding
  removeRecentlyAddedFood: (food: FoodItem) => void; // Function for removing food
}

// Create the context
export const CalorieContext = createContext<CalorieContextProps>({
  calories: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0,
  recentlyAddedFoods: [],
  addNutrients: () => {},
  addRecentlyAddedFood: () => {},
  removeRecentlyAddedFood: () => {}, // Initialize the new function
});

// Create a provider component to wrap around the app
export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [recentlyAddedFoods, setRecentlyAddedFoods] = useState<FoodItem[]>([]);
  const [nextId, setNextId] = useState(1); // Counter for assigning unique IDs

  const addNutrients = (cal: number, proteinAmount: number, fatAmount: number, carbs: number) => {
    setCalories((prevCalories) => prevCalories + cal);
    setProtein((prevProtein) => prevProtein + proteinAmount);
    setFat((prevFat) => prevFat + fatAmount);
    setCarbohydrates((prevCarbs) => prevCarbs + carbs);
  };

  const addRecentlyAddedFood = (food: Omit<FoodItem, 'id'>) => {
    const foodWithId = { ...food, id: nextId }; // Assign the current counter value as the ID
    setRecentlyAddedFoods((prevFoods) => [foodWithId, ...prevFoods.slice(0, 4)]); // Keep only the last 5 items
    setNextId((prevId) => prevId + 1); // Increment the counter for the next food item
  };

  const removeRecentlyAddedFood = (foodToRemove: FoodItem) => {
    setRecentlyAddedFoods((prevFoods) => prevFoods.filter(food => food.id !== foodToRemove.id));
  };

  return (
    <CalorieContext.Provider
      value={{
        calories,
        protein,
        fat,
        carbohydrates,
        recentlyAddedFoods,
        addNutrients,
        addRecentlyAddedFood,
        removeRecentlyAddedFood, // Provide the new function
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
};
