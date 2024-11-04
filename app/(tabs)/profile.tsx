import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker'; // Ensure you have expo-image-picker installed

export default function Profile() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState(""); // State for weight goal
  const [heightFeet, setHeightFeet] = useState(""); // State for height in feet
  const [heightInches, setHeightInches] = useState(""); // State for height in inches
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [userInfoVisible, setUserInfoVisible] = useState(false); // State to toggle user info display
  const [profileImage, setProfileImage] = useState(null); // State for profile image

  const handleRegister = () => {
    // Validate inputs
    if (!name || !email || !phone || !weight || !goal || !heightFeet || !heightInches) {
      setErrorMessage("Please fill in all fields.");
      return; // Stop execution if any field is empty
    }

    // Handle registration logic here
    console.log({ name, email, phone, weight, goal, height: `${heightFeet}'${heightInches}` });
    setModalVisible(false); // Close the modal after registration
    setErrorMessage(""); // Clear error message on successful registration
    setUserInfoVisible(true); // Show user info after registration
  };

  const handleImagePicker = async () => {
    // Request permission to access the camera roll
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
  
    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result.canceled) {  // Change cancelled to canceled
      return; // Stop if the user cancels the picker
    }
  
    // Check if the result URI is valid
    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);  // Update to access uri from the assets array
    }
  };

  const handleLogout = () => {
    // Clear user data and hide profile information
    setName("");
    setEmail("");
    setPhone("");
    setWeight("");
    setHeightFeet("");
    setHeightInches("");
    setGoal("");
    setProfileImage(null);
    setUserInfoVisible(false); // Hide user info
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to The Profile Page</Text>
  
      {/* Conditional rendering of buttons based on userInfoVisible state */}
      {!userInfoVisible && (
        <>
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
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
  
      {/* Registration Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register</Text>
  
            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
  
            <TextInput
              style={[styles.input, !name && styles.inputError]} // Add error style if empty
              placeholder="Name"
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, !email && styles.inputError]} // Add error style if empty
              placeholder="Email"
              placeholderTextColor="gray"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={[styles.input, !phone && styles.inputError]} // Add error style if empty
              placeholder="Phone Number"
              placeholderTextColor="gray"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, !weight && styles.inputError]} // Add error style if empty
              placeholder="Weight"
              placeholderTextColor="gray"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
  
            {/* Height Input Fields */}
            <Text style={styles.heightTitle}>Height:</Text>
            <View style={styles.heightContainer}>
              <TextInput
                style={[styles.heightInput, !heightFeet && styles.inputError]} // Add error style if empty
                placeholder="Feet"
                placeholderTextColor="gray"
                value={heightFeet}
                onChangeText={setHeightFeet}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.heightInput, !heightInches && styles.inputError]} // Add error style if empty
                placeholder="Inches"
                placeholderTextColor="gray"
                value={heightInches}
                onChangeText={setHeightInches}
                keyboardType="numeric"
              />
            </View>
  
            {/* Radio Buttons for Weight Goals */}
            <Text style={styles.goalTitle}>Select your goal:</Text>
            {["Lose Weight", "Gain Weight", "Maintain", "Just Joined for Fun"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioButton}
                onPress={() => setGoal(option)}
              >
                <Text style={goal === option ? styles.radioSelected : styles.radioUnselected}>
                  {goal === option ? "● " : "○ "} {option}
                </Text>
              </TouchableOpacity>
            ))}
  
            <Button title="Submit" onPress={handleRegister} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
  
      {/* User Profile Display */}
      {userInfoVisible && (
        <View style={styles.userProfile}>
          <Text style={styles.userInfoTitle}>User Profile</Text>
          <TouchableOpacity onPress={handleImagePicker}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Upload Profile Picture</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userInfo}>Name: {name}</Text>
          <Text style={styles.userInfo}>Email: {email}</Text>
          <Text style={styles.userInfo}>Phone: {phone}</Text>
          <Text style={styles.userInfo}>Weight: {weight} lbs</Text>
          <Text style={styles.userInfo}>Height: {heightFeet}′ {heightInches}″</Text>
          <Text style={styles.userInfo}>Goal: {goal}</Text>
          
          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "red", // Red border for inputs with errors
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
  heightTitle: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  heightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heightInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  goalTitle: {
    marginVertical: 10,
    fontWeight: "bold",
  },
  radioButton: {
    marginVertical: 5,
  },
  radioSelected: {
    fontSize: 16,
    color: "blue",
  },
  radioUnselected: {
    fontSize: 16,
    color: "black",
  },
  userProfile: {
    alignItems: "center",
    marginTop: 20,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#999",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

