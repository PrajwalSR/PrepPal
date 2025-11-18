import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Main App Component
 * Wraps the app with UserProvider for state management
 * and uses AppNavigator for routing
 */
export default function App() {
  return (
    <UserProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </UserProvider>
  );
}
