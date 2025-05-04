import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState("User"); // 'User' or 'Company'

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/parkease-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Conditional Inputs */}
      {role === "User" ? (
        <TextInput
          style={styles.input}
          placeholder="Plate No."
          placeholderTextColor="#444"
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username or Email Address"
            placeholderTextColor="#444"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#444"
            secureTextEntry
          />
        </>
      )}

      {/* Toggle Role - moved below inputs and resized */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, role === "User" && styles.activeToggle]}
          onPress={() => setRole("User")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "User" && styles.activeToggleText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            role === "Company" && styles.activeToggle,
          ]}
          onPress={() => setRole("Company")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "Company" && styles.activeToggleText,
            ]}
          >
            Company
          </Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => navigation.navigate("RegistrationOptions")}
      >
        <Text style={styles.outlineButtonText}>Create Account</Text>
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
  },
  logoContainer: { alignItems: "center" },
  logo: { width: 300, height: 250, borderRadius: 25 },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  toggleContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 15,
    width: "50%",
    height: 40,
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeToggle: {
    backgroundColor: "#000",
  },
  toggleText: {
    fontSize: 14,
    color: "#000",
  },
  activeToggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 5,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-ExtraBold",
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    width: "60%",
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: "Inter-ExtraBold",
  },
});
