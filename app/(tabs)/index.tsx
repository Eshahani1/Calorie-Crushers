import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalorieContext } from '../CalorieContext'; // Import the context

const MAX_CALORIES = 2000; // Maximum calorie limit

export default function HomeScreen() {
  const { calories, protein, fat } = useContext(CalorieContext);

  const caloriePercentage = (calories / MAX_CALORIES) * 100;
  const proteinCalories = protein * 4;  // 4 calories per gram of protein
  const fatCalories = fat * 9;            // 9 calories per gram of fat
  const totalCalories = calories + proteinCalories + fatCalories; // Total calories consumed

  const proteinPercentage = (proteinCalories / MAX_CALORIES) * 100; 
  const fatPercentage = (fatCalories / MAX_CALORIES) * 100; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Calorie Crushers!</Text>
      <Text style={styles.calorieText}>
        Calories Consumed: {calories} / {MAX_CALORIES}
      </Text>

      <View style={styles.barContainer}>
        <View style={[styles.calorieBar, { width: `${caloriePercentage}%`, backgroundColor: 'blue' }]} />
        <View style={[styles.calorieBar, { width: `${proteinPercentage}%`, backgroundColor: 'orange' }]} />
        <View style={[styles.calorieBar, { width: `${fatPercentage}%`, backgroundColor: 'purple' }]} />
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendItem}>
          <Text style={{ color: 'orange' }}>■</Text> Protein: {proteinPercentage.toFixed(1)}%
        </Text>
        <Text style={styles.legendItem}>
          <Text style={{ color: 'purple' }}>■</Text> Fat: {fatPercentage.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flexDirection: 'row',
    marginBottom: 10, // Add some margin below the bar
  },
  calorieBar: {
    height: '100%',
  },
  legend: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  legendItem: {
    fontSize: 16,
    marginVertical: 2,
  },
});
