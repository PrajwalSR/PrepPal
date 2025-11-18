import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { saveMealPlan } from '../services/mealPlanService';
import { getDayAccuracy } from '../utils/mealPlanGenerator';

const MealPlanResultScreen = ({ route, navigation }) => {
  const { mealPlan } = route.params;
  const [expandedDay, setExpandedDay] = useState(1);

  const handleSave = async () => {
    try {
      const savedPlan = await saveMealPlan({ ...mealPlan, isActive: true });
      Alert.alert('Success', 'Meal plan saved!', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save meal plan');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMealsByDay = (day) => {
    return mealPlan.meals.filter((m) => m.day === day);
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy === 'green') return '#4CAF50';
    if (accuracy === 'yellow') return '#FF9800';
    return '#F44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Meal Plan</Text>
          <Text style={styles.dateRange}>
            {formatDate(mealPlan.startDate)} - {formatDate(mealPlan.endDate)}
          </Text>
        </View>

        {[...Array(mealPlan.days)].map((_, index) => {
          const day = index + 1;
          const dayMeals = getMealsByDay(day);
          const dayMacros = mealPlan.dailyMacros[day];
          const accuracy = getDayAccuracy(dayMacros, mealPlan.targetMacros);
          const isExpanded = expandedDay === day;

          return (
            <View key={day} style={styles.dayCard}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => setExpanded Day(isExpanded ? null : day)}
              >
                <View>
                  <Text style={styles.dayTitle}>Day {day}</Text>
                  <Text style={styles.dayMacros}>
                    {dayMacros.calories} cal • {dayMacros.protein}g P • {dayMacros.carbs}g C • {dayMacros.fat}g F
                  </Text>
                </View>
                <View style={[styles.accuracyDot, { backgroundColor: getAccuracyColor(accuracy) }]} />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.mealsContainer}>
                  {dayMeals.map((meal, idx) => (
                    <View key={idx} style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <Text style={styles.mealType}>{meal.mealType}</Text>
                      </View>
                      <Text style={styles.recipeName}>{meal.recipe.name}</Text>
                      <Text style={styles.recipeMacros}>
                        {meal.recipe.macros.calories} cal • {meal.recipe.macros.protein}g P • 
                        {meal.recipe.macros.carbs}g C • {meal.recipe.macros.fat}g F
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Macro Accuracy</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Within 5% of target</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>Within 10% of target</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>More than 10% off target</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.groceryButton}
            onPress={() => navigation.navigate('GroceryList', { mealPlan })}
          >
            <Text style={styles.groceryButtonText}>View Grocery List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  header: { backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  dateRange: { fontSize: 16, color: '#666' },
  dayCard: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 15, borderRadius: 12, overflow: 'hidden' },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  dayTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  dayMacros: { fontSize: 14, color: '#666' },
  accuracyDot: { width: 16, height: 16, borderRadius: 8 },
  mealsContainer: { padding: 16 },
  mealCard: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 12 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  mealType: { fontSize: 14, fontWeight: '600', color: '#4CAF50', textTransform: 'uppercase' },
  recipeName: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  recipeMacros: { fontSize: 13, color: '#666' },
  legendCard: { backgroundColor: '#FFF', margin: 20, padding: 16, borderRadius: 12 },
  legendTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendText: { fontSize: 14, color: '#666' },
  buttonContainer: { padding: 20, gap: 12 },
  groceryButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  groceryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  saveButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default MealPlanResultScreen;
