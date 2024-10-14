import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
const navigation = useNavigation()
  const handleChange = (value, id) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleNavigateToLogin = () => {
    const correctEmail = "consumer@caremind.ai";
    const correctPassword = "consumer@caremind.ai";
    if (formData.email === correctEmail && formData.password === correctPassword) {
        navigation.navigate("Home");
    } else {
        Alert.alert("Authentication Failed", "Incorrect email or password. Please try again.");
    }
};
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ef1262", "#4361ee"]} style={styles.gradient}>
        <View style={styles.formContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />

          <Text style={styles.signInText}>Sign In</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ffffff"
              value={formData.email}
              onChangeText={(text) => handleChange(text, "email")}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ffffff"
              secureTextEntry={true}
              value={formData.password}
              onChangeText={(text) => handleChange(text, "password")}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNavigateToLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => {
                // navigation.navigate('Signup')
              }}
            >
              Sign Up
            </Text>
          </Text>

          <Text style={styles.footerText}>
            © {new Date().getFullYear()}. AI App All Rights Reserved.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  signInText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    padding: 10,
    color: "#ffffff",
    width: "100%",
  },
  button: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  signupText: {
    marginTop: 20,
    color: "#ffffff",
  },
  signupLink: {
    color: "#ffda79", // Bright yellow or any contrasting color
    textDecorationLine: "underline",
    fontWeight: "bold", // Bold the text for better visibility
  },
  footerText: {
    marginTop: 50,
    color: "#ffffff",
    textAlign: "center",
  },
});
