import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

export default function WelcomeScreen({ navigation }) {
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

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  logoContainer: { marginBottom: 80, alignItems: 'center' },
  logo: { width: 175, height: 175, borderRadius: 25 },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 12.5,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter-ExtraBold',
  },
});
