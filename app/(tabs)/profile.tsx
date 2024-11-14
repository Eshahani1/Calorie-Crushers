import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { auth } from "@/api/firebaseConfig";  // Auth config
import { db } from "@/api/firebaseConfig2";  // Firestore config
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // New state variables
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState("");  // New gender state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Clear email and password fields on logout
      if (!currentUser) {
        setEmail("");
        setPassword("");
      } else {
        fetchProfileData(currentUser.uid);  // Fetch profile data if user is logged in
      }
    });
    return unsubscribe;
  }, []);

  const fetchProfileData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setHeight(userData.height || "");
        setWeight(userData.weight || "");
        setAge(userData.age || "");
        setGoal(userData.goal || "");
        setGender(userData.gender || "");  // Fetch gender data if available
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
      
      // Clear profile edit fields after registration
      setHeight("");
      setWeight("");
      setAge("");
      setGoal("");
      setGender("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
      } else {
        console.error("Unknown error during registration");
      }
    }
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Sign-in error:", error.message);
      } else {
        console.error("Unknown error during sign-in");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
      } else {
        console.error("Unknown error during logout");
      }
    }
  };

  const handleProfileUpdate = async () => {
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          height,
          weight,
          age,
          goal,
          gender,  // Update gender in Firestore as well
        }, { merge: true }); // Merge with existing document
        console.log("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to The Profile Page</Text>

      {!user ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Height (cm):</Text>
            <TextInput
              style={styles.inputField}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Weight (kg):</Text>
            <TextInput
              style={styles.inputField}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Age:</Text>
            <TextInput
              style={styles.inputField}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Goal (Maintain, Gain, Lose):</Text>
            <TextInput
              style={styles.inputField}
              value={goal}
              onChangeText={setGoal}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Gender (Male or Female):</Text>
            <TextInput
              style={styles.inputField}
              value={gender}
              onChangeText={setGender}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleProfileUpdate}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 70,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  inputRow: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: 16,
    color: "#333",
    width: "40%",
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  inputField: {
    width: "55%",
    height: 45,
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
