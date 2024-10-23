import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface CalorieContextProps {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number; // Add carbohydrates
  addNutrients: (cal: number, protein: number, fat: number, carbs: number) => void; // Update function signature
}

// Create the context
export const CalorieContext = createContext<CalorieContextProps>({
  calories: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0, // Initialize carbohydrates
  addNutrients: () => {},
});

// Create a provider component to wrap around the app
export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0); // State for carbohydrates

  const addNutrients = (cal: number, protein: number, fat: number, carbs: number) => {
    setCalories((prevCalories) => prevCalories + cal);
    setProtein((prevProtein) => prevProtein + protein);
    setFat((prevFat) => prevFat + fat);
    setCarbohydrates((prevCarbs) => prevCarbs + carbs); // Update carbohydrates
  };

  return (
    <CalorieContext.Provider value={{ calories, protein, fat, carbohydrates, addNutrients }}>
      {children}
    </CalorieContext.Provider>
  );
};
