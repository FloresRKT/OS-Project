import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useUser } from "../context/UserContext";
import { parkingAPI } from "../services/api";

export default function Dashboard({ navigation }) {
  const { user } = useUser();
  const [parkingData, setParkingData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    fetchLatestListings();
  }, []);

  const fetchLatestListings = async () => {
    try {
      if (user.user_type === "USER") {
        const data = await parkingAPI.getAllListings();
        setParkingData(data);
      } else {
        const data = await parkingAPI.getCompanyListings(user.company_id);
        console.log("Company Listings:", data);
        setParkingData(data);
      }
    } catch (error) {
      console.error("Error fetching parking lots:", error);
    }
  };

  // Pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchLatestListings();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Helper function to determine color based on occupancy percentage
  const getOccupancyColor = (occupancy = 0, total = 1) => {
    const percentage = (occupancy / total) * 100;

    if (percentage >= 90) return "#ff4d4d"; // Red for high occupancy
    if (percentage >= 70) return "#ffaa00"; // Orange for medium occupancy
    return "#4CAF50"; // Green for low occupancy
  };

  return (
    <View style={styles.container}>
      {/* Conditional Rendering */}
      {user.user_type === "USER" ? (
        <>
          {/* Fixed Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search your city/municipality"
              placeholderTextColor="#888"
            />
          </View>

          {/* Header */}
          <View style={styles.searchContainer}>
            <Text style={styles.header}>Latest Listings</Text>
          </View>

          {/* Listings */}
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000"]}
                tintColor="#000"
              />
            }
          >
            {parkingData.map((lot) => (
              <View key={lot.listing_id} style={styles.card}>
                <View style={styles.logoAndDetails}>
                  <Image
                    source={{
                      uri: lot.logo || "https://via.placeholder.com/50",
                    }}
                    style={styles.logo}
                  />
                  <View style={styles.details}>
                    <Text style={styles.companyName}>{lot.name}</Text>
                    <Text style={styles.address}>
                      {lot.unit_number} {lot.street}, {lot.barangay},{" "}
                      {lot.municipality}, {lot.region}, {lot.zip_code}
                    </Text>
                    <Text style={styles.description}>
                      <Text style={styles.label}>Description:</Text>{" "}
                      {lot.description}
                    </Text>
                  </View>
                </View>

                {/* Capacity and Occupancy Information */}
                <View style={styles.capacityContainer}>
                  <Text style={styles.slots}>
                    <Text style={styles.greenText}>
                      {Math.max(0, lot.total_spaces - (lot.occupancy || 0))}
                    </Text>{" "}
                    Available of {lot.total_spaces} spaces
                  </Text>

                  {/* Occupancy Indicator Bar */}
                  <View style={styles.occupancyBarContainer}>
                    <View
                      style={[
                        styles.occupancyBar,
                        {
                          width: `${Math.min(
                            100,
                            ((lot.occupancy || 0) / lot.total_spaces) * 100
                          )}%`,
                          backgroundColor: getOccupancyColor(
                            lot.occupancy,
                            lot.total_spaces
                          ),
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.parkButton}
                  onPress={() =>
                    navigation.navigate("RentalDetails", {
                      listingId: lot.listing_id,
                    })
                  }
                >
                  <Text style={styles.parkButtonText}>Park Here</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          {/* Header */}
          <View style={styles.searchContainer}>
            <Text style={styles.header}>Company Dashboard</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000"]}
                tintColor="#000"
              />
            }
          >
            {/* Company Listings */}
            {parkingData.map((lot) => (
              <View key={lot.listing_id} style={styles.card}>
                <View style={styles.logoAndDetails}>
                  <Image
                    source={{
                      uri: lot.logo || "https://via.placeholder.com/50",
                    }}
                    style={styles.logo}
                  />
                  <View style={styles.details}>
                    <Text style={styles.companyName}>{lot.name}</Text>
                    <Text style={styles.address}>
                      {lot.unit_number} {lot.street}, {lot.barangay},{" "}
                      {lot.municipality}, {lot.region}, {lot.zip_code}
                    </Text>
                    <Text style={styles.description}>
                      <Text style={styles.label}>Description:</Text>{" "}
                      {lot.description}
                    </Text>
                  </View>
                </View>

                {/* Capacity and Occupancy Information */}
                <View style={styles.capacityContainer}>
                  <Text style={styles.slots}>
                    <Text style={styles.greenText}>
                      {Math.max(0, lot.total_spaces - (lot.occupancy || 0))}
                    </Text>{" "}
                    Available of {lot.total_spaces} spaces
                  </Text>

                  {/* Occupancy Indicator Bar */}
                  <View style={styles.occupancyBarContainer}>
                    <View
                      style={[
                        styles.occupancyBar,
                        {
                          width: `${Math.min(
                            100,
                            ((lot.occupancy || 0) / lot.total_spaces) * 100
                          )}%`,
                          backgroundColor: getOccupancyColor(
                            lot.occupancy,
                            lot.total_spaces
                          ),
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={styles.parkButton}
                  onPress={() =>
                    navigation.navigate("RentalDetails", {
                      listingId: lot.listing_id,
                    })
                  }
                >
                  <Text style={styles.parkButtonText}>Park Here</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("CreateListing")}
          >
            <Text style={styles.createButtonText}>Create New Listing</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 40,
    fontSize: 14,
    marginTop: 25,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoAndDetails: {
    flexDirection: "row",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  companyName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
  },
  slots: {
    fontSize: 13,
  },
  greenText: {
    color: "green",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 10,
  },
  parkButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  parkButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  capacityContainer: {
    marginTop: 5,
  },
  occupancyBarContainer: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginTop: 6,
    overflow: "hidden",
  },
  occupancyBar: {
    height: "100%",
    borderRadius: 3,
  },
  createButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
