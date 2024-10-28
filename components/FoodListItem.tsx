import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Alert,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface FoodItem {
  label: string;
  cal: number;
  fat: number;
  protein: number;
  brand: string;
  carbohydrates: number;
}

interface FoodListItemProps {
  item: FoodItem;
  onAddCalories: () => void;
}

const FoodListItem: React.FC<FoodListItemProps> = ({ item, onAddCalories }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; 

  // Function to handle the pop-up notification
  const handleAddCalories = () => {
    onAddCalories(); 

    // Start animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5, 
        duration: 150, 
        useNativeDriver: true, 
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, 
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.label}</Text>
        <Text style={{ color: "dimgray" }}>
          {item.cal} cal, {item.fat}g fat, {item.protein}g protein,{" "}
          {item.carbohydrates}g carbs, {item.brand}
        </Text>
      </View>
      <TouchableOpacity onPress={handleAddCalories}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <AntDesign name="checkcircleo" size={24} color="royalblue" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f8",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodListItem;
