import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../context/UserContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterOptionScreen from "../screens/RegisterOptionScreen";
import RegistrationScreen from "../screens/UserRegistration";
import CompanyRegistration from "../screens/CompanyRegistration";
import UserProfile from "../screens/UserProfile";
import Dashboard from "../screens/DashBoard";
import RentalHistory from "../screens/RentalHistoryScreen";
import YearlyRentalTwoWheeled from "../screens/SPYearly";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Navigation
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Rental History"
        component={RentalHistory}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { user, isLoading } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading) {
      const isLoggedIn = user.user_type !== "GUEST"

      navigation.reset({
        index: 0,
        routes: [{ name: isLoggedIn ? "BottomTabs" : "Welcome" }],
      });
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Welcome"
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="RentalDetails" component={YearlyRentalTwoWheeled} />
      <Stack.Screen
        name="RegistrationOptions"
        component={RegisterOptionScreen}
      />
      <Stack.Screen name="Register" component={RegistrationScreen} />
      {/* Added Company Registration Screen */}
      <Stack.Screen name="CompanyRegister" component={CompanyRegistration} />
    </Stack.Navigator>
  );
}
