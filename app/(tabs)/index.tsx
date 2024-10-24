import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CalorieContext } from "../CalorieContext";

const MAX_CALORIES = 2000;

export default function HomeScreen() {
  const {
    calories,
    protein,
    fat,
    carbohydrates,
    recentlyAddedFoods,
    addNutrients,
    removeRecentlyAddedFood,
  } = useContext(CalorieContext);

  // Calculate total calories consumed
  const totalCalories = calories;

  // Calculate calories from each macronutrient
  const proteinCalories = protein * 4; // Protein: 4 calories per gram
  const fatCalories = fat * 9; // Fat: 9 calories per gram
  const carbCalories = carbohydrates * 4; // Carbohydrates: 4 calories per gram

  // Calculate percentages based on MAX_CALORIES
  const proteinPercentage = (proteinCalories / MAX_CALORIES) * 100;
  const fatPercentage = (fatCalories / MAX_CALORIES) * 100;
  const carbPercentage = (carbCalories / MAX_CALORIES) * 100;
  const totalPercentage = ((totalCalories / MAX_CALORIES) * 100).toFixed(1); // Total percentage of consumed calories

  // Function to handle removing nutrients and food
  const handleRemoveNutrients = (item) => {
    addNutrients(-item.cal, -item.protein, -item.fat, -item.carbohydrates); // Subtract the values
    removeRecentlyAddedFood(item); // Remove the food from the recently added list
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Calorie Crushers!</Text>

      <View style={styles.contentContainer}>
        <Text style={styles.calorieText}>
          Calories Consumed: {totalCalories} / {MAX_CALORIES}
        </Text>

        <View style={styles.barContainer}>
          <View
            style={[
              styles.calorieBar,
              { width: `${totalPercentage}%`, backgroundColor: "blue" },
            ]}
          />
          <View
            style={[
              styles.calorieBar,
              { width: `${proteinPercentage}%`, backgroundColor: "orange" },
            ]}
          />
          <View
            style={[
              styles.calorieBar,
              { width: `${fatPercentage}%`, backgroundColor: "purple" },
            ]}
          />
          <View
            style={[
              styles.calorieBar,
              { width: `${carbPercentage}%`, backgroundColor: "teal" },
            ]}
          />
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendItem}>
            <Text style={{ color: "orange" }}>■</Text> Protein:{" "}
            {proteinPercentage.toFixed(1)}% ({protein.toFixed(1)}g)
          </Text>
          <Text style={styles.legendItem}>
            <Text style={{ color: "purple" }}>■</Text> Fat:{" "}
            {fatPercentage.toFixed(1)}% ({fat.toFixed(1)}g)
          </Text>
          <Text style={styles.legendItem}>
            <Text style={{ color: "teal" }}>■</Text> Carbs:{" "}
            {carbPercentage.toFixed(1)}% ({carbohydrates.toFixed(1)}g)
          </Text>
        </View>

        {/* Display recently added foods with remove ("−") button */}
        <Text style={styles.recentlyAddedTitle}>Recently Added Foods:</Text>
        <FlatList
          data={recentlyAddedFoods}
          renderItem={({ item }) => (
            <View style={styles.foodItemContainer}>
              <Text style={styles.foodItemText}>
                {item.label} - {item.cal} kcal
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveNutrients(item)}
              >
                <Text style={styles.removeButtonText}>−</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()} // Use the unique ID as the key
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  calorieText: {
    fontSize: 18,
    marginBottom: 10,
  },
  barContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 10,
  },
  calorieBar: {
    height: "100%",
  },
  legend: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 10,
  },
  legendItem: {
    fontSize: 16,
    marginVertical: 2,
  },
  recentlyAddedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  foodItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 5,
  },
  foodItemText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ff6347",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, // Add margin to the left for spacing
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
