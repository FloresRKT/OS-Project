import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

export default function UserRegistration({ navigation }) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState('');
  const [plateNumber, setPlateNumber] = useState("");
  const [licenseSerial, setLicenseSerial] = useState("");
  const [carType, setCarType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    if (!lastName || !firstName || !plateNumber || !licenseSerial || !carType) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*
      <Image source={require('../assets/parkease-logo.png')} style={styles.logo} />
      */}

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={plateNumber}
        onChangeText={setEmail}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Plate Number"
        value={plateNumber}
        onChangeText={setPlateNumber}
        autoCapitalize="characters"
      />
      <TextInput
        style={styles.input}
        placeholder="Your Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm your Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/*
      <TextInput
        style={styles.input}
        placeholder="Driver’s License Serial No."
        value={licenseSerial}
        onChangeText={setLicenseSerial}
      />
      <TextInput
        style={styles.input}
        placeholder="Car Type"
        value={carType}
        onChangeText={setCarType}
      />
      */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          Already have an account? Login here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 30,
    resizeMode: "contain",
  },
  input: {
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    width: 160,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter-ExtraBold",
  },
  loginText: {
    color: "#007bff",
    textAlign: "center",
    marginTop: 15,
  },
});
