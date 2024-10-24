import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import fetchData from '@/api/axios';  // Importing axios configuration
import FoodListItem from '@/components/FoodListItem';
import { CalorieContext } from '../CalorieContext';  // Import the context
import { useFocusEffect } from '@react-navigation/native';  // Import useFocusEffect
import React from 'react';

// Define a type for the food item
interface FoodItem {
  label: string;
  cal: number;
  protein: number;
  fat: number;
  brand: string;
  carbohydrates: number;
  ingredients: string[];
}

// Define an array of food categories
const foodCategories = [
  'fruit', 
  'pizza', 
  'hotdog', 
  'vegetables', 
  'chicken', 
  'fish', 
  'pasta', 
  'beef', 
  'seafood', 
  'salad', 
  'soup', 
  'sandwich', 
  'burger', 
  'dessert', 
  'cake', 
  'ice cream', 
  'smoothie', 
  'bread', 
  'rice', 
  'cereal', 
  'snack', 
  'taco', 
  'wrap', 
  'pancake', 
  'waffle', 
  'burrito', 
  'sushi', 
  'stir fry', 
  'curry', 
  'quinoa', 
  'omelette', 
  'pudding', 
  'fruit salad', 
  'popcorn', 
  'cheese', 
  'cottage cheese', 
  'yogurt', 
  'muffin', 
  'croissant', 
  'scone', 
  'pita', 
  'tortilla'
];

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the addNutrients and addRecentlyAddedFood functions from the context
  const { addNutrients, addRecentlyAddedFood } = useContext(CalorieContext);

  // Function to fetch random food items from the API
  const fetchRandomFoods = async () => {
    try {
      // Randomly select a food category from the array
      const randomCategory = foodCategories[Math.floor(Math.random() * foodCategories.length)];
      
      const response = await fetchData({
        ingr: randomCategory,
        'nutrition-type': 'logging',
      });

      // Select items from the response
      const items = response.data.hints.map((item: any) => ({
        label: item.food.label,
        cal: Math.round(item.food.nutrients.ENERC_KCAL),
        protein: Math.round(item.food.nutrients.PROCNT || 0),  // Protein in grams
        fat: Math.round(item.food.nutrients.FAT || 0),         // Fat in grams
        brand: item.food.brand || 'Unknown',
        carbohydrates: Math.round(item.food.nutrients.CHOCDF || 0), // Carbs in grams
        ingredients: item.food.ingredients || [],
      }));

      // Randomly select 5 items
      const shuffled = items.sort(() => 0.5 - Math.random());
      const randomItems = shuffled.slice(0, 5);
      setFoodItems(randomItems);
    } catch (error) {
      console.error('Error fetching random food items from Edamam API:', error);
    }
  };

  // Use useFocusEffect to fetch random foods whenever the tab is opened
  useFocusEffect(
    React.useCallback(() => {
      fetchRandomFoods();
    }, [])
  );

  // Use useEffect to perform search automatically when the search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!search.trim()) {
        return; // No action needed if the search bar is empty
      }

      setLoading(true);

      try {
        const response = await fetchData({
          ingr: search,
          'nutrition-type': 'logging',
        });

        const results: FoodItem[] = response.data.hints.map((item: any) => ({
          label: item.food.label,
          cal: Math.round(item.food.nutrients.ENERC_KCAL),
          protein: Math.round(item.food.nutrients.PROCNT || 0),  // Protein in grams
          fat: Math.round(item.food.nutrients.FAT || 0),         // Fat in grams
          brand: item.food.brand || 'Unknown',
          carbohydrates: Math.round(item.food.nutrients.CHOCDF || 0), // Carbs in grams
          ingredients: item.food.ingredients || [],
        }));

        setFoodItems(results);
      } catch (error) {
        console.error('Error fetching data from Edamam API:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 300); // Adjust the delay as needed (300 ms here)

    return () => clearTimeout(delayDebounceFn); // Cleanup function
  }, [search]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Search Page</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search for food"
        style={styles.input}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Conditionally render the recommended text based on whether the search bar is empty */}
          {!search.trim() && <Text style={styles.recommendedText}>Recommended Items</Text>}
          <FlatList
            data={foodItems}
            renderItem={({ item }) => (
              <FoodListItem 
                item={item} 
                onAddCalories={() => {
                  // Update both the nutrients and recently added food
                  addNutrients(item.cal, item.protein, item.fat, item.carbohydrates);
                  addRecentlyAddedFood(item);  // Add the food to the recently added list
                }}  
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ gap: 5 }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 50,
    gap: 10,
  },
  input: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 20, // Adjust font size as needed
    fontWeight: 'bold', // Make the text bold
    marginBottom: 20, // Space below the text
  },
  recommendedText: {
    fontSize: 18, // Adjust font size for the recommended items text
    fontWeight: 'bold', // Make the text bold
    marginVertical: 10, // Space above and below the text
  },
});
