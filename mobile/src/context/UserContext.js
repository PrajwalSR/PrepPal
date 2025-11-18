import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * UserContext - Manages user profile data
 * For now, stores data locally in AsyncStorage
 * Structured to match MongoDB User schema for easy future migration
 */

const UserContext = createContext({});

const USER_STORAGE_KEY = 'userProfile';

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load user profile from AsyncStorage on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  /**
   * Load user profile from AsyncStorage
   */
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const storedProfile = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setIsOnboarded(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save user profile to AsyncStorage
   * @param {Object} profile - User profile data
   */
  const saveUserProfile = async (profile) => {
    try {
      // Structure data to match MongoDB User schema
      const structuredProfile = {
        // Basic info
        name: profile.name,
        email: profile.email || '', // For future use

        // Stats
        stats: {
          age: profile.age,
          gender: profile.gender,
          height: profile.height,
          weight: profile.weight,
          activityLevel: profile.activityLevel,
        },

        // Fitness goal
        fitnessGoal: profile.fitnessGoal,

        // Macros
        macros: {
          calories: profile.macros?.calories || 0,
          protein: profile.macros?.protein || 0,
          carbs: profile.macros?.carbs || 0,
          fat: profile.macros?.fat || 0,
        },

        // Dietary preferences and allergies
        dietaryPreferences: profile.dietaryPreferences || [],
        allergies: profile.allergies || [],

        // Metadata
        createdAt: profile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(structuredProfile));
      setUserProfile(structuredProfile);
      setIsOnboarded(true);

      return { success: true, profile: structuredProfile };
    } catch (error) {
      console.error('Error saving user profile:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Update user profile (partial update)
   * @param {Object} updates - Fields to update
   */
  const updateUserProfile = async (updates) => {
    try {
      if (!userProfile) {
        throw new Error('No user profile found');
      }

      const updatedProfile = {
        ...userProfile,
        ...updates,
        stats: {
          ...userProfile.stats,
          ...(updates.stats || {}),
        },
        macros: {
          ...userProfile.macros,
          ...(updates.macros || {}),
        },
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Clear user profile from AsyncStorage
   * Useful for testing or if user wants to start over
   */
  const clearUserProfile = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUserProfile(null);
      setIsOnboarded(false);
      return { success: true };
    } catch (error) {
      console.error('Error clearing user profile:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get user profile data
   * @returns {Object|null} - User profile or null
   */
  const getUserProfile = () => {
    return userProfile;
  };

  /**
   * Check if user has completed onboarding
   * @returns {boolean}
   */
  const hasCompletedOnboarding = () => {
    return isOnboarded && userProfile !== null;
  };

  const value = {
    userProfile,
    loading,
    isOnboarded,
    saveUserProfile,
    updateUserProfile,
    clearUserProfile,
    getUserProfile,
    hasCompletedOnboarding,
    loadUserProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook to use UserContext
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
