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
  const [userGender, setUserGender] = useState("");  
  const [userAge, setUserAge] = useState(0);  
  const [userWeight, setUserWeight] = useState(0);  
  const [userHeight, setUserHeight] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          // Reset state before fetching new data
          setUserGoal("");
          setUserGender("");
          setUserAge(0);
          setUserWeight(0);
          setUserHeight(0);
          
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserGoal(userData.goal);
            setUserGender(userData.gender);
            setUserAge(userData.age);
            setUserWeight(userData.weight);
            setUserHeight(userData.height);
            calculateCalories(userData.goal, userData.age, userData.weight, userData.height, userData.gender);
          }
        } else {
          setMaxCalories(2000);  // Default value when no user is logged in
        }
      };
      fetchUserProfile();
    }, []) 
  );

  useEffect(() => {
    calculateCalories(userGoal, userAge, userWeight, userHeight, userGender);
  }, [userGoal, userAge, userWeight, userHeight, userGender]);

  const calculateCalories = (goal: string, age: number, weight: number, height: number, gender: string) => {
    let bmr: number;

    if (gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * 1.2;

    let calorieIntake = tdee;

    if (goal === "Gain") {
      calorieIntake += 500;
    } else if (goal === "Lose") {
      calorieIntake -= 500;
    }

    setMaxCalories(calorieIntake);
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
      <Text style={styles.title}>Welcome to Calorie Crushers!</Text>

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
                {item.label} - {item.cal} kcal {item.brand && `(${item.brand})`}
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
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    padding: 20,
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4a4a4a",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  calorieText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginBottom: 15,
  },
  barContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 20,
  },
  calorieBar: {
    height: "100%",
  },
  legend: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 15,
  },
  legendItem: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 5,
  },
  recentlyAddedTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  foodItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  foodItemText: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: "#ff595e",
    borderRadius: 20,
    padding: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
