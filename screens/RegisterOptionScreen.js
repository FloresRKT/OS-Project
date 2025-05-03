import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterOptionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/*
      <Image
        source={require('../assets/parkease-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      */}
      
      {/* User Registration Button */}
      <TouchableOpacity 
        style={styles.userButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.buttonText}>Register as a User</Text>
      </TouchableOpacity>

      {/* Company Registration Button */}
      <TouchableOpacity 
        style={styles.companyButton}
        onPress={() => navigation.navigate('CompanyRegister')}
      >
        <Text style={styles.companyText}>Register as a Company</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 25,
    marginBottom: 40,
  },
  userButton: {
    backgroundColor: '#000',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginBottom: 16,
  },
  companyButton: {
    borderColor: '#000',
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 16,
  },
  companyText: {
    color: '#000',
    fontFamily: 'Inter-ExtraBold',
    fontSize: 16,
  },
});