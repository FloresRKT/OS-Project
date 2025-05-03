import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const UserProfile= () => {
  const navigation = useNavigation();
  const { user, logout } = useUser();
  
  const [plateNumber, setPlateNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');

  const handleConfirm = () => {
    if (!plateNumber || !licenseNumber || !carBrand || !carModel) {
      Alert.alert('Missing Information', 'Please fill in all required fields marked with *.');
      return;
    }
    navigation.navigate('Dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete your profile</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Plate Number*" 
        value={plateNumber} 
        onChangeText={setPlateNumber} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="License Number*" 
        value={licenseNumber} 
        onChangeText={setLicenseNumber} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Car Brand*" 
        value={carBrand} 
        onChangeText={setCarBrand} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Car Model*" 
        value={carModel} 
        onChangeText={setCarModel} 
      />
      <Button title="Confirm" onPress={handleConfirm} color="#000" />
      <Button title="Logout" onPress={handleLogout} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default UserProfile;