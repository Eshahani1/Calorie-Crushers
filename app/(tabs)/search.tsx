import { View, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import fetchData from '@/api/axios';  // Importing axios configuration
import FoodListItem from '@/components/FoodListItem';

export default function TabTwoScreen() {
  const [search, setSearch] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use useEffect to perform search automatically when the search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!search.trim()) {
        setFoodItems([]); // Clear food items if the search is empty
        return; // Return if search input is empty
      }

      setLoading(true);

      try {
        const response = await fetchData({
          ingr: search,
          'nutrition-type': 'logging',
        });

        const results = response.data.hints.map((item: any) => ({
          label: item.food.label,
          cal: Math.round(item.food.nutrients.ENERC_KCAL),
          brand: item.food.brand || 'Unknown',
          ingredients: item.food.ingredients || [],  // Get ingredients if available
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
  }, [search]); // Only run this effect when 'search' changes

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
          renderItem={({ item }) => <FoodListItem item={item} />}
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
