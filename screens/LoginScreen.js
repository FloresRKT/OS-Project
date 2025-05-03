import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useUser } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
  const [role, setRole] = useState('User'); // 'User' or 'Company'
  const { user, login } = useUser(); // Assuming you have a login function in your context

  const handleMockLogin = () => login(); // Mock login function, replace with actual logic

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.logoContainer}>
        {/*
        <Image
          source={require('../assets/parkease-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        */}
      </View>

      {/* Conditional Inputs */}
      {role === 'USER' ? (
        <TextInput
          style={styles.input}
          placeholder="Plate No."
          placeholderTextColor="#444"
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Username or Email Address"
            placeholderTextColor="#444"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#444"
            secureTextEntry
          />
        </>
      )}

      {/* Toggle Role - moved below inputs and resized */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, user.type === 'USER' && styles.activeToggle]}
          onPress={() => setRole('USER')}
        >
          <Text style={[styles.toggleText, user.type === 'USER' && styles.activeToggleText]}>
            Renter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, user.type === 'COMPANY' && styles.activeToggle]}
          onPress={() => setRole('COMPANY')}
        >
          <Text style={[styles.toggleText, user.type === 'COMPANY' && styles.activeToggleText]}>
            Company
          </Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => handleMockLogin()}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>


      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => navigation.navigate('RegistrationOptions')}
      >
        <Text style={styles.outlineButtonText}>Create Account</Text>
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
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 25,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
    marginBottom: 15,
    width: '50%',
    height: 40,
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeToggle: {
    backgroundColor: '#000',
  },
  toggleText: {
    fontSize: 14,
    color: '#000',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 5,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-ExtraBold',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    width: '60%',
    alignItems: 'center',
  },
  outlineButtonText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Inter-ExtraBold',
  },
});
