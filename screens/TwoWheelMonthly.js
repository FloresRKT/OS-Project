import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

export default function MonthlyRentalTwoWheeled() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [months, setMonths] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [mode, setMode] = useState('reserve');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleMonthsChange = (text) => {
    const intVal = parseInt(text);
    if (!text || (intVal >= 1 && intVal <= 11)) {
      setMonths(text.replace(/[^0-9]/g, ''));
    } else {
      Alert.alert('Invalid Entry', 'You can only input 1 to 11 months.');
      setMonths('');
    }
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    // Navigate to receipt screen here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>ParkWay Solutions</Text>
        <Text style={styles.address}>
          58 Mangga Street, Barangay Tandang Sora, Quezon City, Metro Manila, 1116
        </Text>
      </View>

      <View style={styles.priceBanner}>
        <Text style={styles.priceText}>Month - ₱1,800.00</Text>
      </View>

      <View style={styles.parkingInfo}>
        <Text style={styles.parkingType}>2-wheeled Parking</Text>
        <View style={styles.spaceBox}><Text style={styles.spaceText}>8</Text></View>
        <Text style={styles.availableText}>Available space</Text>
      </View>

      {mode === 'reserve' && (
        <>
          <View style={styles.row}>
            <View style={[styles.dateInput, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dropdownBox}>
                <Text>{selectedDate || 'Select a date'}</Text>
                <Ionicons name="chevron-down" size={20} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Months</Text>
              <TextInput
                style={styles.dropdownBox}
                keyboardType="numeric"
                maxLength={2}
                value={months}
                onChangeText={handleMonthsChange}
                placeholder="0"
              />
            </View>
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
        *An additional of ₱0.20 will be added every minute as a penalty once the vehicle hasn’t been recovered after the 30 minutes allowance given once the rent time has lapsed.
      </Text>

      <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowConfirmDialog(true)}>
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

      <Modal visible={showConfirmDialog} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.dialogBox}>
            <TouchableOpacity onPress={() => setShowConfirmDialog(false)} style={styles.closeIcon}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
            <Text style={styles.dialogTitle}>Are you sure?</Text>
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
    backBtn: { position: 'absolute', top: 20, left: 10 },
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
    dialogConfirmBtn: {
      backgroundColor: '#000',
      padding: 10,
      borderRadius: 6,
      marginTop: 10,
    },
  });
  
