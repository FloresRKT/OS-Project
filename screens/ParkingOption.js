import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ParkingDetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Header Info */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://via.placeholder.com/50?text=P' }} style={styles.logo} />
        <View>
          <Text style={styles.companyName}>ParkWay Solutions</Text>
          <Text style={styles.address}>
            58 Mangga Street, Barangay Tandang Sora, Quezon City, Metro Manila, 1116
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      {/* 2-Wheeled Parking */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>2-wheeled Parking</Text>
          <Text style={styles.slots}>
            <Text style={styles.green}>8</Text> Available space
          </Text>
        </View>

        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Hourly</Text>
          <Text style={styles.rateLabel}>Daily</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₱25.00/3 hours</Text>
          <Text style={styles.price}>₱180.00/Day</Text>
        </View>

        <View style={styles.selectRow}>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Standard Parking */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Standard Parking</Text>
          <Text style={styles.slots}>
            <Text style={styles.green}>19</Text> Available space
          </Text>
        </View>

        <View style={styles.rateRow}>
          <Text style={styles.rateLabel}>Hourly</Text>
          <Text style={styles.rateLabel}>Daily</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₱35.00/3 hours</Text>
          <Text style={styles.price}>₱180.00/Day</Text>
        </View>

        <View style={styles.selectRow}>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectButton}>
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: { position: 'absolute', top: 40, left: 20, zIndex: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 10 },
  logo: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  companyName: { fontWeight: 'bold', fontSize: 16 },
  address: { fontSize: 13, maxWidth: 250 },
  separator: { height: 1, backgroundColor: 'black', marginVertical: 10 },

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginVertical: 10,
    marginBottom:'12.5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontWeight: 'bold', fontSize: 14 },
  slots: { fontSize: 13 },
  green: { color: 'green', fontWeight: 'bold' },

  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  rateLabel: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  price: { flex: 1, textAlign: 'center' },

  selectRow: { flexDirection: 'row' },
  selectButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    marginTop: 2,
  },
  selectText: { color: '#fff', fontWeight: 'bold' },
});
