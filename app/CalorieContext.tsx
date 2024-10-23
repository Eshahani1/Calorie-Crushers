import React, { createContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface CalorieContextProps {
  calories: number;
  addCalories: (cal: number) => void;
}

// Create the context
export const CalorieContext = createContext<CalorieContextProps>({
  calories: 0,
  addCalories: () => {},
});

// Create a provider component to wrap around the app
export const CalorieProvider = ({ children }: { children: ReactNode }) => {
  const [calories, setCalories] = useState(0);

  const addCalories = (cal: number) => {
    setCalories((prevCalories) => prevCalories + cal);
  };

  return (
    <CalorieContext.Provider value={{ calories, addCalories }}>
      {children}
    </CalorieContext.Provider>
  );
};
