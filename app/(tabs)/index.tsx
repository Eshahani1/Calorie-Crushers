import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalorieContext } from '../CalorieContext'; // Import the context

const MAX_CALORIES = 2000; // Maximum calorie limit

export default function HomeScreen() {
  // Get the calories from the context
  const { calories } = useContext(CalorieContext);

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
