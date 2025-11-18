import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../context/UserContext';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MacroResultScreen from '../screens/MacroResultScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MealPlanSetupScreen from '../screens/MealPlanSetupScreen';
import MealPlanGeneratingScreen from '../screens/MealPlanGeneratingScreen';
import MealPlanResultScreen from '../screens/MealPlanResultScreen';
import GroceryListScreen from '../screens/GroceryListScreen';
import MealPlanListScreen from '../screens/MealPlanListScreen';

const Stack = createStackNavigator();

/**
 * AppNavigator - Main navigation component
 * Handles routing based on user onboarding status
 */
const AppNavigator = () => {
  const { isOnboarded, loading } = useUser();

  // Show loading spinner while checking user status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isOnboarded ? (
          // Onboarding Stack (for users who haven't completed setup)
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{
                title: 'Setup Your Profile',
                headerLeft: null, // Disable back button to prevent going back to welcome
              }}
            />
            <Stack.Screen
              name="MacroResult"
              component={MacroResultScreen}
              options={{
                title: 'Your Results',
                headerLeft: null, // Disable back button
              }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                title: 'Dashboard',
                headerLeft: null, // Disable back button once in dashboard
              }}
            />
          </>
        ) : (
          // Main App Stack (for users who have completed onboarding)
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                title: 'PrepPal',
              }}
            />
            <Stack.Screen
              name="MealPlanSetup"
              component={MealPlanSetupScreen}
              options={{
                title: 'Create Meal Plan',
              }}
            />
            <Stack.Screen
              name="MealPlanGenerating"
              component={MealPlanGeneratingScreen}
              options={{
                title: 'Generating...',
                headerLeft: null,
              }}
            />
            <Stack.Screen
              name="MealPlanResult"
              component={MealPlanResultScreen}
              options={{
                title: 'Your Meal Plan',
              }}
            />
            <Stack.Screen
              name="GroceryList"
              component={GroceryListScreen}
              options={{
                title: 'Grocery List',
              }}
            />
            <Stack.Screen
              name="MealPlanList"
              component={MealPlanListScreen}
              options={{
                title: 'My Meal Plans',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AppNavigator;
