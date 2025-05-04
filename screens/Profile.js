import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

export default function Profile({ navigation }) {
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have a user logged in
  useEffect(() => {
    if (!user) {
      // Redirect to login if no user is logged in
      navigation.replace("Login");
    }
  }, [user, navigation]);

  const handleLogout = () => {
    setIsLoading(true);
    logout();
    navigation.replace("Login");
  };

  // Handle edit profile navigation
  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { userId: user.user_id });
  };

  if (!user || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>
          {isLoading ? "Logging out..." : "Loading profile..."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={
            user.profile_image
              ? { uri: user.profile_image }
              : require("../assets/default-avatar.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {user.user_type === "USER"
            ? `${user.first_name} ${user.last_name}`
            : user.name}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.typeBadge}>
          {user.user_type === "USER" ? "Renter" : "Company"}
        </Text>
      </View>

      {/* Profile Content - Different for User vs Company */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        {/* User-specific information */}
        {user.user_type === "USER" && (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Email Address:</Text>
              <Text style={styles.infoText}>
                {user.email || "Not provided"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="car-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Plate Number:</Text>
              <Text style={styles.infoText}>
                {user.plate_number || "Not provided"}
              </Text>
            </View>
          </>
        )}

        {/* Company-specific information */}
        {user.user_type === "COMPANY" && (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Company Name:</Text>
              <Text style={styles.infoText}>{user.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Business Phone:</Text>
              <Text style={styles.infoText}>
                {user.phone_number || "Not provided"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Business Address:</Text>
              <Text style={styles.infoText}>
                {user.address || "Not provided"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Registration #:</Text>
              <Text style={styles.infoText}>
                {user.registration_number || "Not provided"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoLabel}>Established:</Text>
              <Text style={styles.infoText}>
                {new Date(user.date_joined || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          </>
        )}

        {/*}
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        */}

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  header: {
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  typeBadge: {
    backgroundColor: "#000",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    marginTop: 5,
    overflow: "hidden",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    paddingBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  infoText: {
    flex: 2,
    color: "#333",
  },
  actionButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: "#000",
    marginTop: 10,
  },
});
