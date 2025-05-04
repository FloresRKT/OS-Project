import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useUser } from "../context/UserContext";
import { authAPI, userAPI } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // 'USER' or 'COMPANY'
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();

  const handleMockLogin = () => login(); // Mock login function, replace with actual logic

  // Handle the login submission
  const handleLogin = async () => {
    // Form validation
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter both email and password."
      );
      return;
    }

    try {
      setIsLoading(true);

      let userData = null;

      if (role === "USER") {
        userData = await authAPI.userLogin(email, password);
      } else if (role === "COMPANY") {
        userData = await authAPI.companyLogin(email, password);
      }

      // Check if we got a valid response with user data
      if (userData && userData.user_id && role === "USER") {
        console.log(userData);
        fetchData = await userAPI.getUser(userData.user_id);
        console.log(fetchData);
        login(fetchData);
      } else if (userData && userData.user_id && role === "COMPANY") {
        console.log(userData);
        fetchData = await userAPI.getCompany(userData.user_id);
        console.log(fetchData);
        login(fetchData);
      } else {
        // If we got a response but no user data
        Alert.alert(
          "Login Failed",
          "Invalid credentials or server error. Please try again."
        );
      }
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.logoContainer}>
        {/*
        <Image
          source={require('../assets/parkease-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        */}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#444"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#444"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Toggle Role */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, role === "USER" && styles.activeToggle]}
          onPress={() => setRole("USER")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "USER" && styles.activeToggleText,
            ]}
          >
            Renter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            role === "COMPANY" && styles.activeToggle,
          ]}
          onPress={() => setRole("COMPANY")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "COMPANY" && styles.activeToggleText,
            ]}
          >
            Company
          </Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
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
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 25,
  },
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
