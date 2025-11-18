import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Switch } from 'react-native';
import { useUser } from '../context/UserContext';
import { getRecipes } from '../services/mealPlanService';

const MealPlanSetupScreen = ({ navigation }) => {
  const { userProfile } = useUser();
  const [days, setDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [useUserMacros, setUseUserMacros] = useState(true);

  const handleGenerate = async () => {
    try {
      const recipes = await getRecipes();
      const required = days * mealsPerDay;
      
      if (recipes.length < required) {
        Alert.alert(
          'Not Enough Recipes',
          `You need at least ${required} recipes to create this meal plan. You currently have ${recipes.length} recipes. Please add more recipes first!`,
          [{ text: 'OK' }]
        );
        return;
      }

      const config = {
        days,
        mealsPerDay,
        targetMacros: useUserMacros ? userProfile.macros : userProfile.macros,
        dietaryPreferences: userProfile.dietaryPreferences || [],
        allergies: userProfile.allergies || [],
      };

      navigation.navigate('MealPlanGenerating', { config });
    } catch (error) {
      Alert.alert('Error', 'Failed to start meal plan generation');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create Your Meal Plan</Text>
        <Text style={styles.subtitle}>Let's set up your personalized meal plan</Text>

        <View style={styles.section}>
          <Text style={styles.label}>How many days?</Text>
          <View style={styles.optionsRow}>
            {[3, 5, 7].map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.option, days === d && styles.optionSelected]}
                onPress={() => setDays(d)}
              >
                <Text style={[styles.optionText, days === d && styles.optionTextSelected]}>
                  {d} days
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Meals per day?</Text>
          <View style={styles.optionsRow}>
            {[2, 3, 4].map((m) => (
              <TouchableOpacity
                key={m}
                style={[styles.option, mealsPerDay === m && styles.optionSelected]}
                onPress={() => setMealsPerDay(m)}
              >
                <Text style={[styles.optionText, mealsPerDay === m && styles.optionTextSelected]}>
                  {m} meals
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <Text style={styles.label}>Use my macro targets</Text>
              <Text style={styles.sublabel}>
                {userProfile?.macros?.calories || 0} cal, {userProfile?.macros?.protein || 0}g protein
              </Text>
            </View>
            <Switch value={useUserMacros} onValueChange={setUseUserMacros} />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Plan Summary</Text>
          <Text style={styles.summaryText}>• {days} days of meal planning</Text>
          <Text style={styles.summaryText}>• {mealsPerDay} meals per day</Text>
          <Text style={styles.summaryText}>• Total meals: {days * mealsPerDay}</Text>
          <Text style={styles.summaryText}>
            • Target: {userProfile?.macros?.calories || 0} cal/day
          </Text>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>Generate Meal Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  section: { marginBottom: 30 },
  label: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  sublabel: { fontSize: 14, color: '#666', marginTop: 4 },
  optionsRow: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  optionSelected: { borderColor: '#4CAF50', backgroundColor: '#E8F5E9' },
  optionText: { fontSize: 16, color: '#666' },
  optionTextSelected: { color: '#4CAF50', fontWeight: 'bold' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
  },
  toggleLabel: { flex: 1 },
  summaryCard: {
    backgroundColor: '#FFF9E6',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    marginBottom: 20,
  },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  summaryText: { fontSize: 16, color: '#666', marginBottom: 6 },
  generateButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  generateButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default MealPlanSetupScreen;
