import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to The Profile Page</Text>

      {/* Sign In Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Sign In Pressed")}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Register Pressed")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center", 
    padding: 20,
  },
  welcomeText: {
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20, 
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15, 
    borderRadius: 5, 
    width: "80%",
    alignItems: "center", 
    marginVertical: 10, 
  },
  buttonText: {
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold", 
  },
});
