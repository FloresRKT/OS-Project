import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { parkingAPI } from "../services/api";
import { useUser } from "../context/UserContext";

export default function CreateListing({ navigation }) {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [region, setRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [totalSpaces, setTotalSpaces] = useState("");
  const [ratePerDay, setRatePerDay] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Form validation
    if (
      !name ||
      !street ||
      !barangay ||
      !municipality ||
      !region ||
      !zipCode ||
      !totalSpaces ||
      !ratePerDay
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await parkingAPI.addParkingLot({
        body: JSON.stringify({
          company_id: user.company_id,
          unit_number: unitNumber,
          street,
          barangay,
          municipality,
          region,
          zip_code: zipCode,
          total_spaces: Number(totalSpaces),
          rate_per_day: Number(ratePerDay),
          description,
        }),
      });

      Alert.alert("Success", "Parking listing created successfully!", [
        { text: "OK", onPress: () => navigation.navigate("BottomTabs") },
      ]);
    } catch (error) {
      console.error("Create listing error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>List Your Parking Space</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          
          <Text style={styles.label}>Unit/Building Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Unit or building number"
            value={unitNumber}
            onChangeText={setUnitNumber}
          />

          <Text style={styles.label}>Street*</Text>
          <TextInput
            style={styles.input}
            placeholder="Street name"
            value={street}
            onChangeText={setStreet}
          />

          <Text style={styles.label}>Barangay*</Text>
          <TextInput
            style={styles.input}
            placeholder="Barangay"
            value={barangay}
            onChangeText={setBarangay}
          />

          <Text style={styles.label}>Municipality/City*</Text>
          <TextInput
            style={styles.input}
            placeholder="Municipality or city"
            value={municipality}
            onChangeText={setMunicipality}
          />

          <Text style={styles.label}>Region/Province*</Text>
          <TextInput
            style={styles.input}
            placeholder="Region or province"
            value={region}
            onChangeText={setRegion}
          />

          <Text style={styles.label}>ZIP Code*</Text>
          <TextInput
            style={styles.input}
            placeholder="ZIP code"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
          />

          <Text style={styles.sectionTitle}>Parking Details</Text>
          
          <Text style={styles.label}>Total Parking Spaces*</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of available spaces"
            value={totalSpaces}
            onChangeText={setTotalSpaces}
            keyboardType="numeric"
          />
          
          <Text style={styles.label}>Rate per Day (₱)*</Text>
          <TextInput
            style={styles.input}
            placeholder="Daily rate"
            value={ratePerDay}
            onChangeText={setRatePerDay}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter details about your parking space"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Creating..." : "Create Listing"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 15,
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
