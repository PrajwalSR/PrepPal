import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { generateMealPlan } from '../services/mealPlanService';

const MealPlanGeneratingScreen = ({ route, navigation }) => {
  const { config } = route.params;
  const [statusText, setStatusText] = useState('Analyzing your recipes...');

  const statusMessages = [
    'Analyzing your recipes...',
    'Matching macros to your goals...',
    'Creating your perfect meal plan...',
    'Almost there...',
  ];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % statusMessages.length;
      setStatusText(statusMessages[messageIndex]);
    }, 1500);

    const generateTimeout = setTimeout(async () => {
      clearInterval(messageInterval);
      try {
        const mealPlan = await generateMealPlan(config);
        navigation.replace('MealPlanResult', { mealPlan });
      } catch (error) {
        console.error('Error generating meal plan:', error);
        navigation.goBack();
      }
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(generateTimeout);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🍽️</Text>
        </View>
        
        <ActivityIndicator size="large" color="#4CAF50" style={styles.spinner} />
        
        <Text style={styles.statusText}>{statusText}</Text>
        
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: { fontSize: 50 },
  spinner: { marginBottom: 30 },
  statusText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  dotsContainer: { flexDirection: 'row', gap: 10 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DDD',
  },
  dotActive: { backgroundColor: '#4CAF50' },
});

export default MealPlanGeneratingScreen;
