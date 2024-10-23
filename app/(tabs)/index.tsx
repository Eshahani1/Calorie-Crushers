import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CalorieContext } from '../CalorieContext'; 

const MAX_CALORIES = 2000; 

export default function HomeScreen() {
  const { calories, protein, fat, carbohydrates } = useContext(CalorieContext);

  // Calculate total calories consumed
  const totalCalories = calories;

  // Calculate calories from each macronutrient
  const proteinCalories = protein * 4; // Protein: 4 calories per gram
  const fatCalories = fat * 9;         // Fat: 9 calories per gram
  const carbCalories = carbohydrates * 4; // Carbohydrates: 4 calories per gram

  // Calculate percentages based on MAX_CALORIES
  const proteinPercentage = (proteinCalories / MAX_CALORIES) * 100; 
  const fatPercentage = (fatCalories / MAX_CALORIES) * 100; 
  const carbPercentage = (carbCalories / MAX_CALORIES) * 100; 
  const totalPercentage = ((totalCalories / MAX_CALORIES) * 100).toFixed(1); // Total percentage of consumed calories

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Calorie Crushers!</Text>
      
      {/* Additional View for spacing and separation */}
      <View style={styles.contentContainer}>
        <Text style={styles.calorieText}>
          Calories Consumed: {totalCalories} / {MAX_CALORIES}
        </Text>

        <View style={styles.barContainer}>
          <View style={[styles.calorieBar, { width: `${totalPercentage}%`, backgroundColor: 'blue' }]} />
          <View style={[styles.calorieBar, { width: `${proteinPercentage}%`, backgroundColor: 'orange' }]} />
          <View style={[styles.calorieBar, { width: `${fatPercentage}%`, backgroundColor: 'purple' }]} />
          <View style={[styles.calorieBar, { width: `${carbPercentage}%`, backgroundColor: 'teal' }]} /> 
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendItem}>
            <Text style={{ color: 'orange' }}>■</Text> Protein: {proteinPercentage.toFixed(1)}%
          </Text>
          <Text style={styles.legendItem}>
            <Text style={{ color: 'purple' }}>■</Text> Fat: {fatPercentage.toFixed(1)}%
          </Text>
          <Text style={styles.legendItem}>
            <Text style={{ color: 'teal' }}>■</Text> Carbs: {carbPercentage.toFixed(1)}% 
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, // Increased margin for separation
    marginTop: 40, // Add top margin for more spacing from the top
  },
  contentContainer: {
    flex: 1, // Allow content to take up remaining space
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Center content horizontally
    width: '100%', // Full width for the content
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
    marginBottom: 10, 
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
