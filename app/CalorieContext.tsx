import React, { createContext, useState, ReactNode } from "react";

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
  addNutrients: (
    cal: number,
    protein: number,
    fat: number,
    carbs: number
  ) => void;
  addRecentlyAddedFood: (food: Omit<FoodItem, "id">) => void; 
  removeRecentlyAddedFood: (food: FoodItem) => void; 
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
  removeRecentlyAddedFood: () => {}, 
});

// Create a provider component to wrap around the app
export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [recentlyAddedFoods, setRecentlyAddedFoods] = useState<FoodItem[]>([]);
  const [nextId, setNextId] = useState(1); 

  const addNutrients = (
    cal: number,
    proteinAmount: number,
    fatAmount: number,
    carbs: number
  ) => {
    setCalories((prevCalories) => prevCalories + cal);
    setProtein((prevProtein) => prevProtein + proteinAmount);
    setFat((prevFat) => prevFat + fatAmount);
    setCarbohydrates((prevCarbs) => prevCarbs + carbs);
  };

  const addRecentlyAddedFood = (food: Omit<FoodItem, "id">) => {
    const foodWithId = { ...food, id: nextId }; 
    setRecentlyAddedFoods((prevFoods) => [
      foodWithId,
      ...prevFoods.slice(0, 4),
    ]); 
    setNextId((prevId) => prevId + 1); 
  };

  const removeRecentlyAddedFood = (foodToRemove: FoodItem) => {
    setRecentlyAddedFoods((prevFoods) =>
      prevFoods.filter((food) => food.id !== foodToRemove.id)
    );
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
        removeRecentlyAddedFood, 
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
};
