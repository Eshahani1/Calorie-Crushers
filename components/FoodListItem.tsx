import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

// Define the type for the item prop
interface FoodItem {
    label: string;
    cal: number;
    fat: number;  
    protein: number;  
    brand: string;
    carbohydrates: number;  // Include carbs in the FoodItem type
}

// Define the props type for the component
interface FoodListItemProps {
    item: FoodItem;
    onAddCalories: () => void;  // Add onAddCalories prop
}

const FoodListItem: React.FC<FoodListItemProps> = ({ item, onAddCalories }) => {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.label}</Text>
                <Text style={{ color: 'dimgray' }}>
                    {item.cal} cal, {item.fat}g fat, {item.protein}g protein, {item.carbohydrates}g carbs, {item.brand}
                </Text>
            </View>
            <TouchableOpacity onPress={onAddCalories}>
                <AntDesign name="pluscircleo" size={24} color="royalblue" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f6f6f8',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default FoodListItem;
