import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { parkingAPI } from "../services/api";

export default function YearlyRentalTwoWheeled({ navigation, route }) {
  const { listingId } = route.params || {};
  const { user } = useUser();

  // State variables
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [mode, setMode] = useState("reserve");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullyBooked, setIsFullyBooked] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [dynamicPrice, setDynamicPrice] = useState(1800);
  const [queueLength, setQueueLength] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  // Helper function to get the month of the start date
  const getStartMonth = () => {
    const nextMonth = new Date().getMonth() + 1;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${months[nextMonth]}`;
  };

  // Helper function to format month and year for display
  const getFormattedMonthYear = () => {
    const month = getStartMonth();

    return `${month} 1, ${selectedYear}`;
  };

  // Helper to calculate end date (1 month after the selected month)
  const calculateEndDate = () => {
    if (selectedMonth === null) {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      return oneMonthLater.toISOString().split("T")[0];
    }

    // Create date from selected month/year
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    return endDate.toISOString().split("T")[0];
  };

  // Fetch listing details when component mounts
  useEffect(() => {
    if (!listingId) {
      setError("No listing ID provided");
      setLoading(false);
      return;
    }

    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        const data = await parkingAPI.getListingById(listingId);
        setListing(data);

        // Check if fully booked
        const isBooked = data.occupancy >= data.total_spaces;
        setIsFullyBooked(isBooked);

        if (isBooked) {
          // Fetch queue information
          try {
            const queueData = await parkingAPI.getBookingQueue(listingId);
            setQueueLength(queueData.length || 0);

            // Calculate dynamic price based on queue length
            // For example: 5% increase for each person in queue
            const priceIncrease = 1 + (queueData.length+1) * 0.05;
            const newPrice = Math.round(
              (data.rate_per_day * 30).toFixed(2) * priceIncrease
            );
            setDynamicPrice(newPrice);

            // Set user's position in queue if they join
            setQueuePosition(queueData.length);
          } catch (queueErr) {
            console.error("Error fetching queue data:", queueErr);
          }
        }
      } catch (err) {
        console.error("Error fetching listing details:", err);
        setError("Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [listingId]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date.toISOString().split("T")[0]);
  };

  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    
    try {
      let response;
      
      if (isFullyBooked) {
        // Add to queue if fully booked
        response = await parkingAPI.addToQueue({
          listing_id: listingId,
          user_id: user.user_id,
          plate_number: user?.plate_number || "",
          start_date: getStartDate(),
          end_date: calculateEndDate(),
          total_cost: dynamicPrice,
        });
        
        navigation.navigate("ConfirmationScreen", {
          success: true,
          isQueue: true,
          position: response.position,
          listingName: listing.name,
          startDate: getFormattedMonthYear(),
        });
      } else {
        // Normal booking process
        const bookingData = {
          owner_id: listing?.owner_id,
          renter_id: user?.user_id,
          listing_id: listingId,
          plate_number: user?.plate_number || "",
          start_date: getStartDate(),
          end_date: calculateEndDate(),
          total_cost: listing.rate_per_day * 30,
          status: "pending",
        };
        
        response = await parkingAPI.createBooking(bookingData);
        
        navigation.navigate("ConfirmationScreen", {
          success: true,
          isQueue: false,
          bookingId: response.rent_id,
          listingName: listing.name,
          startDate: getFormattedMonthYear(),
        });
      }
    } catch (error) {
      console.error("Error during booking process:", error);
      Alert.alert("Error", "Failed to complete your booking. Please try again.");
    }
  };

  // Get start date for API
  const getStartDate = () => {
    const today = new Date();
    const currentDay = today.getDate();

    if (selectedMonth === null) {
      // If no month selected, use current month if day is 1, otherwise next month
      if (currentDay === 1) {
        return today.toISOString().split("T")[0];
      } else {
        // Move to first day of next month
        const nextMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );
        return nextMonth.toISOString().split("T")[0];
      }
    }

    // If user selected this month but it's past the 1st day
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    if (
      selectedMonth === currentMonth &&
      selectedYear === currentYear &&
      currentDay > 1
    ) {
      // Move to first day of next month
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      return nextMonth.toISOString().split("T")[0];
    }

    // Otherwise use the selected month's first day
    return new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0];
  };

  // Get start date for datepicker
  const getStartDatePicker = () => {
    const today = new Date();

    if (today >= 1) {
      // Move to first day of next month
      const nextMonth = new Date(currentYear, currentMonth + 1, 1);
      return nextMonth.toISOString().split("T")[0];
    }

    // Otherwise use the selected month's first day
    return new Date(selectedYear, selectedMonth, 1).toISOString().split("T")[0];
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Loading listing details...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{listing.name}</Text>
        <Text style={styles.address}>
          {listing.unit_number} {listing.street}, {listing.barangay},{" "}
          {listing.municipality}, {listing.region}, {listing.zip_code}
        </Text>
      </View>
      <View style={styles.parkingInfo}>
        <Text style={styles.parkingType}>Monthly Parking</Text>
        <View style={styles.spaceBox}>
          <Text style={styles.spaceText}>
            {Math.max(0, listing.total_spaces - (listing.occupancy || 0))}
          </Text>
        </View>
        <Text style={styles.availableText}>Available space</Text>
      </View>
      <View style={styles.bookingStatusContainer}>
        {isFullyBooked ? (
          <>
            <View style={styles.queueBanner}>
              <Ionicons name="alert-circle" size={20} color="#fff" />
              <Text style={styles.queueText}>
                This location is fully booked
              </Text>
            </View>
            <View style={styles.queueInfoBox}>
              <Text style={styles.queueInfoText}>
                You will be placed in a reservation queue (Position:{" "}
                {Math.max(0, queuePosition + 1)})
              </Text>
              <Text style={styles.queuePriceText}>
                Due to high demand, the price has increased to:
              </Text>
              <Text style={styles.dynamicPriceText}>
                ₱{dynamicPrice.toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.availableBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.availableText}>Instant booking available!</Text>
          </View>
        )}
      </View>
      {/* Price banner */}
      <View style={styles.priceBanner}>
        <Text style={styles.priceText}>
          Price for {getStartMonth()} -{" "}
          {isFullyBooked
            ? `₱${dynamicPrice.toFixed(2)}`
            : `₱${(listing.rate_per_day * 30).toFixed(2)}`}
        </Text>
      </View>
      {mode === "reserve" && (
        <>
          {/*
          <View style={styles.dateInput}>
            <Text style={styles.label}>Start Month</Text>
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              style={styles.dropdownBox}
            >
              <Text>{getFormattedMonthYear()}</Text>
              <Ionicons name="chevron-down" size={20} />
            </TouchableOpacity>
          </View>
          */}

          {/*
          <Text style={styles.note}>
            *Note: The company has the right to refuse accepting your
            reservation once you try to use it a day after the intended date of
            reservation. The maximum date to reserve is the 7th day from this
            day.
          </Text>
          */}
        </>
      )}
      {mode === "reserve" && (
        <View>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.dropdownBox}>
            <Text>{paymentMethod}</Text>
            <Ionicons name="chevron-down" size={20} />
          </View>
        </View>
      )}
      {/*
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "reserve" && styles.activeToggle]}
          onPress={() => setMode("reserve")}
        >
          <Text
            style={
              mode === "reserve"
                ? styles.activeToggleText
                : styles.inactiveToggleText
            }
          >
            Reserve
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === "park" && styles.activeToggle]}
          onPress={() => setMode("park")}
        >
          <Text
            style={
              mode === "park"
                ? styles.activeToggleText
                : styles.inactiveToggleText
            }
          >
            Park Now
          </Text>
        </TouchableOpacity>
      </View>
      */}
      {/*
      <Text style={styles.penalty}>
        *An additional of ₱0.20 will be added every minute as a penalty once the
        vehicle hasn't been recovered after the 30 minutes allowance given once
        the rent time has lapsed.
      </Text>
      */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => setShowConfirmDialog(true)}
      >
        <Text style={styles.confirmText}>
          {isFullyBooked ? "Join Queue" : "Confirm"}
        </Text>
      </TouchableOpacity>
      {/*}
      {showMonthPicker && (
        <DateTimePicker
          value={
            selectedMonth !== null
              ? new Date(selectedYear, selectedMonth, 1)
              : new Date()
          }
          mode="date"
          display="spinner"
          onChange={handleMonthChange}
          minimumDate={getStartDatePicker()}
        />
      )}
      */}
      {/* Confirmation Dialog */}
      <Modal visible={showConfirmDialog} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.dialogBox}>
            <TouchableOpacity
              onPress={() => setShowConfirmDialog(false)}
              style={styles.closeIcon}
            >
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
            <Text style={styles.dialogTitle}>Are you sure?</Text>
            <Text style={styles.dialogContent}>
              {isFullyBooked
                ? `You are about to ${
                    isFullyBooked ? "join the reservation queue" : "reserve"
                  } a parking space at ${
                    listing?.name || "this location"
                  } starting on ${getFormattedMonthYear()}.
                ${
                  isFullyBooked
                    ? `\n\nYou will be in queue position #${queuePosition + 1}.`
                    : ""
                }`
                : `You are about to park at ${
                    listing?.name || "this location"
                  } for 1 month starting at ${getFormattedMonthYear()}.`}
            </Text>
            <TouchableOpacity
              style={styles.dialogConfirmBtn}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  centered: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", marginBottom: 20, fontSize: 16 },
  backButton: { position: "absolute", top: 20, left: 10 },
  header: { alignItems: "center", marginTop: 50 },
  title: { fontSize: 18, fontWeight: "bold" },
  address: { textAlign: "center", fontSize: 12 },
  priceBanner: {
    backgroundColor: "#FFD700",
    padding: 10,

    marginBottom: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  priceText: { fontWeight: "bold" },
  parkingInfo: {
    backgroundColor: "#000",
    marginTop: 12,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  parkingType: { color: "#fff", fontWeight: "bold" },
  spaceBox: {
    backgroundColor: "#00C851",
    padding: 4,
    borderRadius: 6,
    marginVertical: 4,
  },
  spaceText: { color: "#fff", fontWeight: "bold" },
  availableText: { color: "#fff", fontSize: 10 },
  dateInput: { marginTop: 10 },
  label: { fontWeight: "bold", marginBottom: 4 },
  dropdownBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  note: { fontSize: 10, marginVertical: 6 },
  toggleButtons: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "center",
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: "#000" },
  activeToggleText: { color: "#fff", textAlign: "center" },
  inactiveToggleText: { color: "#000", textAlign: "center" },
  penalty: { fontSize: 10, marginVertical: 10 },
  confirmBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#888",
  },
  confirmText: { color: "#fff", fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  closeIcon: { position: "absolute", top: 10, left: 10 },
  dialogTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  dialogContent: {
    textAlign: "center",
    marginBottom: 10,
  },
  dialogConfirmBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  // Add these styles
  queueBanner: {
    backgroundColor: "#f44336", // Red
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  queueText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  queueInfoBox: {
    backgroundColor: "#ffebee", // Light red
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  queueInfoText: {
    fontSize: 14,
    marginBottom: 5,
  },
  queuePriceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dynamicPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f44336",
  },
  availableBanner: {
    backgroundColor: "#4caf50", // Green
    padding: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  bookingStatusContainer: {
    marginVertical: 0,
  },
  dialogPriceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
