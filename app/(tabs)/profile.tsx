import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { auth } from "@/api/firebaseConfig";  
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  
  useEffect(() => {
    setEmail(""); 
    setPassword(""); 

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is signed in:", currentUser);
      } else {
        setUser(null);
        console.log("No user is signed in.");
      }
    });

    return unsubscribe;
  }, []);  

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);
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

  return (
    <View style={styles.container}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
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
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
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
