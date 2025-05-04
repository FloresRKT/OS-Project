import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Pressable, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { parkingAPI } from '../services/api';

export default function YearlyRentalTwoWheeled({ navigation, route }) {
  const { listingId } = route.params || {};
  const { user } = useUser();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [mode, setMode] = useState('reserve');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log("Listing details:", data);
        setListing(data);
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
    if (date) setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleConfirm = () => {
    // Build the booking data
    const bookingData = {
      owner_id: listing?.owner_id,
      renter_id: user?.user_id,
      listing_id: listingId,
      plate_number: user?.plate_number || "",
      start_date: selectedDate || new Date().toISOString().split('T')[0],
      end_date: calculateEndDate(),
      total_cost: 1800, // Yearly cost as shown in the UI
      status: "pending"
    };

    console.log("Creating booking with data:", bookingData);
    setShowConfirmDialog(false);
    
    // Here you'd call your API to create the booking
    // bookingAPI.createBooking(bookingData).then(...)
    
    // For now we'll just navigate
    navigation.navigate("ReceiptScreen", { bookingData });
  };

  // Calculate end date (1 year from start date)
  const calculateEndDate = () => {
    const startDate = selectedDate ? new Date(selectedDate) : new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    return endDate.toISOString().split('T')[0];
  };

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{marginTop: 10}}>Loading listing details...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.confirmBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{listing?.name || "ParkWay Solutions"}</Text>
        <Text style={styles.address}>
          {listing.unit_number} {listing.street}, {listing.barangay}, {listing.municipality}, {listing.region}, {listing.zip_code}
        </Text>
      </View>

      <View style={styles.priceBanner}>
        <Text style={styles.priceText}>1 year - ₱1,800.00</Text>
      </View>

      <View style={styles.parkingInfo}>
        <Text style={styles.parkingType}>2-wheeled Parking</Text>
        <View style={styles.spaceBox}>
          <Text style={styles.spaceText}>
            {listing ? (listing.total_spaces - (listing.occupancy || 0)) : 8}
          </Text>
        </View>
        <Text style={styles.availableText}>Available space</Text>
      </View>

      {mode === 'reserve' && (
        <>
          <View style={styles.dateInput}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dropdownBox}>
              <Text>{selectedDate || 'Select a date'}</Text>
              <Ionicons name="chevron-down" size={20} />
            </TouchableOpacity>
          </View>

          <Text style={styles.note}>
            *Note: The company has the right to refuse accepting your reservation once you try to use it a day after the intended date of reservation. The maximum date to reserve is the 7th day from this day.
          </Text>
        </>
      )}

      {mode === 'reserve' && (
        <View>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.dropdownBox}>
            <Text>{paymentMethod}</Text>
            <Ionicons name="chevron-down" size={20} />
          </View>
        </View>
      )}

      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'reserve' && styles.activeToggle]}
          onPress={() => setMode('reserve')}
        >
          <Text style={mode === 'reserve' ? styles.activeToggleText : styles.inactiveToggleText}>Reserve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, mode === 'park' && styles.activeToggle]}
          onPress={() => setMode('park')}
        >
          <Text style={mode === 'park' ? styles.activeToggleText : styles.inactiveToggleText}>Park Now</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.penalty}>
        *An additional of ₱0.20 will be added every minute as a penalty once the vehicle hasn't been recovered after the 30 minutes allowance given once the rent time has lapsed.
      </Text>

      <TouchableOpacity 
        style={[styles.confirmBtn, !selectedDate && mode === 'reserve' && styles.disabledButton]} 
        onPress={() => setShowConfirmDialog(true)}
        disabled={!selectedDate && mode === 'reserve'}
      >
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Confirmation Dialog */}
      <Modal visible={showConfirmDialog} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.dialogBox}>
            <TouchableOpacity onPress={() => setShowConfirmDialog(false)} style={styles.closeIcon}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
            <Text style={styles.dialogTitle}>Are you sure?</Text>
            <Text style={styles.dialogContent}>
              {mode === 'reserve' 
                ? `You are about to reserve a parking space at ${listing?.name || 'this location'} starting on ${selectedDate || 'today'}.` 
                : `You are about to park at ${listing?.name || 'this location'} for 1 year starting today.`}
            </Text>
            <TouchableOpacity style={styles.dialogConfirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', marginBottom: 20, fontSize: 16 },
  backButton: { position: 'absolute', top: 20, left: 10 },
  header: { alignItems: 'center', marginTop: 50 },
  title: { fontSize: 18, fontWeight: 'bold' },
  address: { textAlign: 'center', fontSize: 12 },
  priceBanner: {
    backgroundColor: '#FFD700',
    padding: 10,
    marginTop: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  priceText: { fontWeight: 'bold' },
  parkingInfo: {
    backgroundColor: '#000',
    marginTop: 12,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  parkingType: { color: '#fff', fontWeight: 'bold' },
  spaceBox: {
    backgroundColor: '#00C851',
    padding: 4,
    borderRadius: 6,
    marginVertical: 4,
  },
  spaceText: { color: '#fff', fontWeight: 'bold' },
  availableText: { color: '#fff', fontSize: 10 },
  dateInput: { marginTop: 10 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  note: { fontSize: 10, marginVertical: 6 },
  toggleButtons: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
  },
  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: '#000' },
  activeToggleText: { color: '#fff', textAlign: 'center' },
  inactiveToggleText: { color: '#000', textAlign: 'center' },
  penalty: { fontSize: 10, marginVertical: 10 },
  confirmBtn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#888',
  },
  confirmText: { color: '#fff', fontWeight: 'bold' },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: '#fff',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: { position: 'absolute', top: 10, left: 10 },
  dialogTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  dialogContent: { 
    textAlign: 'center', 
    marginBottom: 10 
  },
  dialogConfirmBtn: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
});
