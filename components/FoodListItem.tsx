import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

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
    // Function to handle the pop-up notification
    const handleAddCalories = () => {
        onAddCalories();  // Execute the function passed from the parent

        // Show a pop-up notification
        if (Platform.OS === 'android') {
            ToastAndroid.show(`${item.label} added to your list!`, ToastAndroid.SHORT);
        } else {
            Alert.alert('Food Added', `${item.label} added to your list!`);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, gap: 5 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.label}</Text>
                <Text style={{ color: 'dimgray' }}>
                    {item.cal} cal, {item.fat}g fat, {item.protein}g protein, {item.carbohydrates}g carbs, {item.brand}
                </Text>
            </View>
            <TouchableOpacity onPress={handleAddCalories}>
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
