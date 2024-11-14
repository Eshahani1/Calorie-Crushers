import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { CalorieContext } from "../CalorieContext";
import { db } from "@/api/firebaseConfig2";  // Firestore config
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { auth } from "@/api/firebaseConfig";  // Auth config
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

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

  const [maxCalories, setMaxCalories] = useState(2000); 
  const [userGoal, setUserGoal] = useState("");  
  const [userGender, setUserGender] = useState("");  // New state for gender
  const [userAge, setUserAge] = useState(0);  // New state for age
  const [userWeight, setUserWeight] = useState(0);  // New state for weight
  const [userHeight, setUserHeight] = useState(0);  // New state for height

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserGoal(userData.goal);  // Set the user's goal
            setUserGender(userData.gender);  // Set the user's gender
            setUserAge(userData.age);  // Set the user's age
            setUserWeight(userData.weight);  // Set the user's weight
            setUserHeight(userData.height);  // Set the user's height
            calculateCalories(userData.goal, userData.age, userData.weight, userData.height, userData.gender);
          }
        }
      };
      fetchUserProfile();
    }, []) 
  );

  useEffect(() => {
    calculateCalories(userGoal, userAge, userWeight, userHeight, userGender);  
  }, [userGoal, userAge, userWeight, userHeight, userGender]);  // Add all dependencies for calculation
  
  const calculateCalories = (goal: string, age: number, weight: number, height: number, gender: string) => {
    // Basal Metabolic Rate (BMR) calculation based on gender
    let bmr: number;

    if (gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;  // Mifflin-St Jeor for males
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;  // Mifflin-St Jeor for females
    }

    // Total Daily Energy Expenditure (TDEE) calculation based on activity level (optional)
    // You can adjust this with a multiplier if the user is more or less active.
    // For example:
    const tdee = bmr * 1.2;  // Sedentary activity level (you can adjust based on the user's activity level)

    // Adjust calorie intake based on the user's goal
    let calorieIntake = tdee;

    if (goal === "Gain") {
      calorieIntake += 500;  // Surplus for gaining weight
    } else if (goal === "Lose") {
      calorieIntake -= 500;  // Deficit for losing weight
    }

    setMaxCalories(calorieIntake);  // Update the state with the calculated calorie intake
  };

  const totalCalories = Math.round(calories); 

  const proteinCalories = protein * 4;
  const fatCalories = fat * 9; 
  const carbCalories = carbohydrates * 4; 

  const proteinPercentage = (proteinCalories / maxCalories) * 100;
  const fatPercentage = (fatCalories / maxCalories) * 100;
  const carbPercentage = (carbCalories / maxCalories) * 100;

  const handleRemoveNutrients = (item) => {
    addNutrients(-item.cal, -item.protein, -item.fat, -item.carbohydrates); 
    removeRecentlyAddedFood(item); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Calorie Crushers!</Text>

      <View style={styles.contentContainer}>
        <Text style={styles.calorieText}>
          Calories Consumed: {totalCalories} / {maxCalories}
        </Text>

        <View style={styles.barContainer}>
          <View
            style={[styles.calorieBar, { width: `${proteinPercentage}%`, backgroundColor: "orange" }]} />
          <View
            style={[styles.calorieBar, { width: `${fatPercentage}%`, backgroundColor: "purple" }]} />
          <View
            style={[styles.calorieBar, { width: `${carbPercentage}%`, backgroundColor: "teal" }]} />
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
          keyExtractor={(item) => item.id.toString()} 
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
    alignItems: "flex-start", 
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 5,
    width: "100%", 
  },
  foodItemText: {
    fontSize: 16,
    flex: 1, 
    marginRight: 10, 
    maxHeight: 50, 
  },
  removeButton: {
    backgroundColor: "#ff6347",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10, 
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
