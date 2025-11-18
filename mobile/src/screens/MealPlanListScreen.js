import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { getAllMealPlans, deleteMealPlan } from '../services/mealPlanService';

const MealPlanListScreen = ({ navigation }) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMealPlans();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMealPlans();
    });
    return unsubscribe;
  }, [navigation]);

  const loadMealPlans = async () => {
    setLoading(true);
    const plans = await getAllMealPlans();
    setMealPlans(plans);
    setLoading(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Meal Plan',
      'Are you sure you want to delete this meal plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteMealPlan(id);
            loadMealPlans();
          },
        },
      ]
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading meal plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (mealPlans.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No Meal Plans Yet</Text>
          <Text style={styles.emptyText}>Create your first meal plan to get started!</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('MealPlanSetup')}
          >
            <Text style={styles.createButtonText}>Create Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {mealPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => navigation.navigate('MealPlanResult', { mealPlan: plan })}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planDate}>
                {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
              </Text>
              {plan.isActive && <View style={styles.activeBadge}><Text style={styles.activeBadgeText}>Active</Text></View>}
            </View>
            <Text style={styles.planInfo}>
              {plan.days} days • {plan.mealsPerDay} meals/day • {plan.meals.length} total meals
            </Text>
            <Text style={styles.planMacros}>
              Target: {plan.targetMacros.calories} cal • {plan.targetMacros.protein}g protein
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(plan.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('MealPlanSetup')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { fontSize: 16, color: '#666' },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center' },
  createButton: { backgroundColor: '#4CAF50', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 25 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  scrollView: { flex: 1, padding: 20 },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  planDate: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  activeBadge: { backgroundColor: '#4CAF50', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  planInfo: { fontSize: 14, color: '#666', marginBottom: 4 },
  planMacros: { fontSize: 14, color: '#666', marginBottom: 12 },
  deleteButton: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12 },
  deleteButtonText: { color: '#F44336', fontSize: 14, fontWeight: '600' },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
});

export default MealPlanListScreen;
