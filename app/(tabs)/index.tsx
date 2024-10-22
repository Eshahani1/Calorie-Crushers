import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const MAX_CALORIES = 2000; // Maximum calorie limit

export default function HomeScreen() {
  // State to track current calorie intake
  const [calories, setCalories] = useState(0);

  // Calculate the percentage of the calorie bar based on current intake
  const caloriePercentage = (calories / MAX_CALORIES) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Calorie Crushers!</Text>

      {/* Calorie Counter */}
      <Text style={styles.calorieText}>Calories Consumed: {calories} / {MAX_CALORIES}</Text>
      
      {/* Calorie Bar */}
      <View style={styles.barContainer}>
        <View style={[styles.calorieBar, { width: `${caloriePercentage}%` }]} />
      </View>

      {/* Example Button to Increase Calories for Testing */}
      <Text style={styles.button} onPress={() => setCalories(calories + 200)}>Add 200 Calories</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set background color to white
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calorieText: {
    fontSize: 18,
    marginBottom: 10,
  },
  barContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  calorieBar: {
    height: '100%',
    backgroundColor: '#76c7c0', // Color of the filled part of the bar
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
  },
});
