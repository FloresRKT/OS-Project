import React from "react";
import AppNavigation from "./navigation/AppNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </UserProvider>
  );
}
