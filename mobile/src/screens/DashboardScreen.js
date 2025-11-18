import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import { getActiveMealPlan, getRecipes, saveRecipes } from '../services/mealPlanService';
import sampleRecipes from '../data/sampleRecipes';

/**
 * DashboardScreen - Main app dashboard
 * Shows user stats, active meal plan, and quick actions
 */
const DashboardScreen = ({ navigation }) => {
  const { userProfile, clearUserProfile } = useUser();
  const [activeMealPlan, setActiveMealPlan] = useState(null);
  const [recipesLoaded, setRecipesLoaded] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDashboardData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    const plan = await getActiveMealPlan();
    setActiveMealPlan(plan);

    const recipes = await getRecipes();
    if (recipes.length === 0) {
      await saveRecipes(sampleRecipes);
      setRecipesLoaded(true);
    } else {
      setRecipesLoaded(true);
    }
  };

  const handleResetProfile = async () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure? This will delete all your data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: async () => {
          await clearUserProfile();
          navigation.replace('Welcome');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.greeting}>Hi, {userProfile?.name || 'Friend'}! 👋</Text>

        {activeMealPlan ? (
          <View style={styles.activePlanCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Active Meal Plan</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MealPlanResult', { mealPlan: activeMealPlan })}>
                <Text style={styles.viewLink}>View →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.planDates}>
              {new Date(activeMealPlan.startDate).toLocaleDateString()} - {new Date(activeMealPlan.endDate).toLocaleDateString()}
            </Text>
            <Text style={styles.planInfo}>{activeMealPlan.days} days • {activeMealPlan.mealsPerDay} meals/day</Text>
            <TouchableOpacity
              style={styles.groceryLink}
              onPress={() => navigation.navigate('GroceryList', { mealPlan: activeMealPlan })}
            >
              <Text style={styles.groceryLinkText}>🛒 View Grocery List</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noPlanCard}>
            <Text style={styles.noPlanText}>No active meal plan</Text>
            <TouchableOpacity style={styles.createPlanButton} onPress={() => navigation.navigate('MealPlanSetup')}>
              <Text style={styles.createPlanButtonText}>Create Meal Plan</Text>
            </TouchableOpacity>
          </View>
        )}

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

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MealPlanSetup')}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Create New Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MealPlanList')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>View All Meal Plans</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleResetProfile}>
          <Text style={styles.resetButtonText}>Reset Profile (Testing)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1, padding: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  activePlanCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  viewLink: { color: '#4CAF50', fontSize: 16, fontWeight: '600' },
  planDates: { fontSize: 14, color: '#666', marginBottom: 4 },
  planInfo: { fontSize: 14, color: '#666', marginBottom: 12 },
  groceryLink: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8, alignItems: 'center' },
  groceryLinkText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  noPlanCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  noPlanText: { fontSize: 16, color: '#666', marginBottom: 16 },
  createPlanButton: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  createPlanButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statsContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#666' },
  actionsContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20 },
  actionsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionIcon: { fontSize: 24, marginRight: 12 },
  actionText: { fontSize: 16, color: '#333', fontWeight: '500' },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  resetButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
});

export default DashboardScreen;
