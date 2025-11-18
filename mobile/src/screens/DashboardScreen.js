import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useUser } from '../context/UserContext';

/**
 * DashboardScreen - Main app dashboard (placeholder for now)
 * Will be built out in the next phase
 */
const DashboardScreen = ({ navigation }) => {
  const { userProfile, clearUserProfile } = useUser();

  const handleResetProfile = async () => {
    await clearUserProfile();
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Message */}
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Welcome, {userProfile?.name || 'Friend'}!</Text>
        <Text style={styles.subtitle}>Dashboard Coming Soon</Text>

        {/* Quick Stats Preview */}
        {userProfile?.macros && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Daily Targets</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{userProfile.macros.calories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{userProfile.macros.protein}g</Text>
                <Text style={styles.statLabel}>Protein</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{userProfile.macros.carbs}g</Text>
                <Text style={styles.statLabel}>Carbs</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{userProfile.macros.fat}g</Text>
                <Text style={styles.statLabel}>Fat</Text>
              </View>
            </View>
          </View>
        )}

        {/* Coming Soon Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Coming Soon:</Text>
          <FeatureItem icon="🍽️" text="Recipe library with AI-powered suggestions" />
          <FeatureItem icon="📅" text="Weekly meal planning" />
          <FeatureItem icon="🎥" text="Extract recipes from YouTube videos" />
          <FeatureItem icon="📊" text="Progress tracking and analytics" />
          <FeatureItem icon="🛒" text="Auto-generated shopping lists" />
        </View>

        {/* Reset Button (for testing) */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>Reset Profile (Testing)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Feature Item Component
const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DashboardScreen;
