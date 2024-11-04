import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner"; 
import { CalorieContext } from "../CalorieContext"; 
import fetchData from "@/api/barcode"; 

export default function Barcode() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [nutrientData, setNutrientData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addNutrients, addRecentlyAddedFood } = useContext(CalorieContext); 

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const fetchNutrientData = async (barcode) => {
    setLoading(true);
    try {
      const response = await fetchData(barcode); 
      const data = response.data;
      const nutrients = data.hints[0]?.food.nutrients || {};
      setNutrientData(nutrients);

      // Add nutrients to context
      addNutrients(
        nutrients.ENERC_KCAL || 0, 
        nutrients.PROCNT || 0,     
        nutrients.FAT || 0,        
        nutrients.CHOCDF || 0      
      );

      const foodItem = {
        label: data.hints[0]?.food.label || "Unknown Food",
        cal: nutrients.ENERC_KCAL || 0,
        fat: nutrients.FAT || 0,
        protein: nutrients.PROCNT || 0,
        carbohydrates: nutrients.CHOCDF || 0,
        brand: data.hints[0]?.food.brand || "Unknown Brand"
      };
      addRecentlyAddedFood(foodItem); 
    } catch (error) {
      console.error("Error fetching nutrient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData(`Type: ${type}\nData: ${data}`);
    fetchNutrientData(data); 
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <View style={styles.scannerBox} />
        <Text style={styles.scannedText}>Scan a barcode or QR code!</Text>
        {loading && <ActivityIndicator size="large" color="#007bff" />}
        {scannedData && (
          <View style={styles.scannedData}>
            <Text style={styles.scannedText}>Item Added!</Text>
            <TouchableOpacity
              onPress={() => setScannedData(null)} 
              style={styles.button}
            >
              <Text style={styles.buttonText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scannerBox: {
    width: 250,
    height: 250,
    borderColor: "#007bff",
    borderWidth: 4,
    borderRadius: 10,
    position: "absolute",
    top: "30%", 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 123, 255, 0.2)", 
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  scannedData: {
    marginTop: 20,
    alignItems: "center",
  },
  scannedText: {
    fontSize: 18,
    color: "#fff", 
  },
  nutrientData: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
