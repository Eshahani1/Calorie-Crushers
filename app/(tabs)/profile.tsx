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
    justifyContent: "center", // Center the content vertically
    padding: 20,
  },
  welcomeText: {
    fontSize: 20, // Optional: Adjust font size for better readability
    fontWeight: "bold", // Optional: Make the text bold
    marginBottom: 20, // Space below the welcome text
  },
  button: {
    backgroundColor: "#4CAF50", // Green background color
    padding: 15, // Padding for button
    borderRadius: 5, // Rounded corners
    width: "80%", // Button width
    alignItems: "center", // Center text horizontally
    marginVertical: 10, // Space between buttons
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 16, // Font size for button text
    fontWeight: "bold", // Optional: Make the button text bold
  },
});
