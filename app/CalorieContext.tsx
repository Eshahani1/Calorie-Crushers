import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface CalorieContextProps {
  calories: number;
  protein: number;
  fat: number;
  addNutrients: (cal: number, protein: number, fat: number) => void;
}

// Create the context
export const CalorieContext = createContext<CalorieContextProps>({
  calories: 0,
  protein: 0,
  fat: 0,
  addNutrients: () => {},
});

// Create a provider component to wrap around the app
export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);

  const addNutrients = (cal: number, protein: number, fat: number) => {
    setCalories((prevCalories) => prevCalories + cal);
    setProtein((prevProtein) => prevProtein + protein);
    setFat((prevFat) => prevFat + fat);
  };

  return (
    <CalorieContext.Provider value={{ calories, protein, fat, addNutrients }}>
      {children}
    </CalorieContext.Provider>
  );
};
