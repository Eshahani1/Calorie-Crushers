import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import fetchData from '@/api/axios';  // Importing axios configuration
import FoodListItem from '@/components/FoodListItem';
import { CalorieContext } from '../CalorieContext';  // Import the context

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

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the addNutrients and addRecentlyAddedFood functions from the context
  const { addNutrients, addRecentlyAddedFood } = useContext(CalorieContext);

  // Use useEffect to perform search automatically when the search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!search.trim()) {
        setFoodItems([]); // Clear food items if the search is empty
        return;
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
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search for food"
        style={styles.input}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
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
});
