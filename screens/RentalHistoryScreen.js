import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../context/UserContext";
import { bookingAPI } from "../services/api";

export default function RentalHistory({ navigation }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'past'
  const [rentalData, setRentalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data when user changes
  useEffect(() => {
    if (user?.user_id) {
      fetchRentalHistory();
    } else {
      setIsLoading(false);
      console.log("User not authenticated. Please log in.");
    }
  }, [user]);

  const fetchRentalHistory = async () => {
    try {
      setIsLoading(true);

      // Fetch user's rental history
      const data = await bookingAPI.getUserBookings(user.user_id);
      setRentalData(data || []);
    } catch (error) {
      console.error("Error fetching rental history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to "Month Day, Year"
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter rentals based on active tab
  const getFilteredRentals = () => {
    const currentDate = new Date();

    if (activeTab === "active") {
      // Show bookings where end date is in the future
      return rentalData.filter((rental) => {
        const endDate = new Date(rental.endTime);
        return endDate >= currentDate;
      });
    } else {
      // Show bookings where end date is in the past
      return rentalData.filter((rental) => {
        const endDate = new Date(rental.endTime);
        return endDate < currentDate;
      });
    }
  };

  const filteredRentals = getFilteredRentals();

  // Tab header component
  const TabHeader = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "active" && styles.activeTab]}
        onPress={() => setActiveTab("active")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "active" && styles.activeTabText,
          ]}
        >
          Active
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "past" && styles.activeTab]}
        onPress={() => setActiveTab("past")}
      >
        <Text
          style={[styles.tabText, activeTab === "past" && styles.activeTabText]}
        >
          Past
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.searchContainer}>
        <Text style={styles.header}>Rental History</Text>
      </View>

      {/* Tab Navigation */}
      <TabHeader />

      {/* Loading Indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading rentals...</Text>
        </View>
      ) : (
        <>
          {/* Rental Listings */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {filteredRentals.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {activeTab === "active"
                    ? "No active rentals found"
                    : "No past rental history found"}
                </Text>
              </View>
            ) : (
              filteredRentals.map((rental) => (
                <View key={rental.id} style={styles.card}>
                  <View style={styles.logoAndDetails}>
                    <Image
                      source={{
                        uri: rental.logo || "https://via.placeholder.com/50",
                      }}
                      style={styles.logo}
                    />
                    <View style={styles.details}>
                      <Text style={styles.companyName}>
                        {rental.companyName}
                      </Text>

                      <Text style={styles.dateInfo}>
                        <Text style={styles.label}>Start: </Text>
                        {formatDate(rental.startTime)}
                      </Text>

                      <Text style={styles.dateInfo}>
                        <Text style={styles.label}>End: </Text>
                        {formatDate(rental.startTime)}
                      </Text>

                      <View style={styles.statusContainer}>
                        <Text style={styles.label}>Status: </Text>
                        <Text
                          style={[
                            styles.statusBadge,
                            rental.status === "active"
                              ? styles.activeStatus
                              : styles.pastStatus,
                          ]}
                        >
                          {rental.status}
                        </Text>
                      </View>

                      <Text style={styles.price}>
                        <Text style={styles.label}>Rate: </Text>₱
                        {rental.amount?.toFixed(2) || "0.00"}
                      </Text>

                      <Text style={styles.price}>
                        <Text style={styles.label}>Balance: </Text>₱
                        {rental.remainingAmount?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.separator} />

                  <TouchableOpacity
                    style={[
                      styles.detailsButton,
                      activeTab === "past" && styles.pastButton,
                    ]}
                    onPress={() =>
                      navigation.navigate("RentalDetails", {
                        rentalId: rental.id,
                      })
                    }
                  >
                    <Text style={styles.detailsButtonText}>
                      {activeTab === "active" ? "View Details" : "View Receipt"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
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
    marginTop: "25",
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
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingVertical: 10,
    justifyContent: "space-around",
  },
  navButton: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 12,
    marginTop: 3,
    fontFamily: "Inter-Medium",
  },
  // Add these new styles:
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  emptyState: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  dateInfo: {
    fontSize: 13,
    marginBottom: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    overflow: "hidden",
  },
  activeStatus: {
    backgroundColor: "#e7f7ed",
    color: "#00a651",
  },
  pastStatus: {
    backgroundColor: "#f2f2f2",
    color: "#666",
  },
  price: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  detailsButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  pastButton: {
    backgroundColor: "#666",
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
