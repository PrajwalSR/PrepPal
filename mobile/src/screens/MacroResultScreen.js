import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

/**
 * MacroResultScreen - Displays calculated macro results
 * Shows daily calorie target and macro breakdown with transparency
 */
const MacroResultScreen = ({ route, navigation }) => {
  const { macros, userProfile } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.header}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.headerTitle}>Your Personalized Plan</Text>
          <Text style={styles.headerSubtitle}>
            Based on your profile, here are your daily nutrition targets
          </Text>
        </View>

        {/* Macro Cards */}
        <View style={styles.macroContainer}>
          {/* Calories */}
          <View style={[styles.macroCard, styles.calorieCard]}>
            <Text style={styles.macroLabel}>Daily Calories</Text>
            <Text style={styles.macroValue}>{macros.calories}</Text>
            <Text style={styles.macroUnit}>kcal</Text>
          </View>

          {/* Protein */}
          <View style={[styles.macroCard, styles.proteinCard]}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{macros.protein}</Text>
            <Text style={styles.macroUnit}>grams</Text>
            <Text style={styles.macroPercentage}>
              {Math.round((macros.protein * 4 * 100) / macros.calories)}% of calories
            </Text>
          </View>

          {/* Carbs */}
          <View style={[styles.macroCard, styles.carbsCard]}>
            <Text style={styles.macroLabel}>Carbohydrates</Text>
            <Text style={styles.macroValue}>{macros.carbs}</Text>
            <Text style={styles.macroUnit}>grams</Text>
            <Text style={styles.macroPercentage}>
              {Math.round((macros.carbs * 4 * 100) / macros.calories)}% of calories
            </Text>
          </View>

          {/* Fat */}
          <View style={[styles.macroCard, styles.fatCard]}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{macros.fat}</Text>
            <Text style={styles.macroUnit}>grams</Text>
            <Text style={styles.macroPercentage}>
              {Math.round((macros.fat * 9 * 100) / macros.calories)}% of calories
            </Text>
          </View>
        </View>

        {/* Calculation Transparency */}
        <View style={styles.transparencyContainer}>
          <Text style={styles.transparencyTitle}>📊 How We Calculated This</Text>

          <View style={styles.calculationStep}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Basal Metabolic Rate (BMR)</Text>
              <Text style={styles.stepDescription}>
                Your body burns {macros.details.bmr} calories per day at rest (Mifflin-St Jeor
                equation)
              </Text>
            </View>
          </View>

          <View style={styles.calculationStep}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Activity Adjustment</Text>
              <Text style={styles.stepDescription}>
                Multiplied by {macros.details.activityMultiplier}× for your activity level ={' '}
                {macros.details.tdee} calories (TDEE)
              </Text>
            </View>
          </View>

          <View style={styles.calculationStep}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Goal Adjustment</Text>
              <Text style={styles.stepDescription}>
                {macros.details.calorieAdjustment > 0 && (
                  <>Added {macros.details.calorieAdjustment} calories for muscle gain</>
                )}
                {macros.details.calorieAdjustment < 0 && (
                  <>Subtracted {Math.abs(macros.details.calorieAdjustment)} calories for weight loss</>
                )}
                {macros.details.calorieAdjustment === 0 && <>No adjustment for maintenance</>}
              </Text>
            </View>
          </View>

          <View style={styles.calculationStep}>
            <Text style={styles.stepNumber}>4</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Macro Distribution</Text>
              <Text style={styles.stepDescription}>
                Protein: {userProfile.fitnessGoal === 'lose_weight' ? '1.8' : '2.0'}g per kg body
                weight{'\n'}
                Fat: ~27% of total calories{'\n'}
                Carbs: Remaining calories
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
          <TipItem
            text="These are targets, not strict limits. Aim to get within ±5% of these numbers."
          />
          <TipItem text="Protein is crucial for muscle maintenance and satiety." />
          <TipItem text="Spread your meals throughout the day for better energy levels." />
          <TipItem text="Stay hydrated! Aim for 2-3 liters of water daily." />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate('Dashboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Tip Item Component
const TipItem = ({ text }) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipBullet}>•</Text>
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  successEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  macroContainer: {
    padding: 20,
  },
  macroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieCard: {
    borderLeftColor: '#FF9800',
  },
  proteinCard: {
    borderLeftColor: '#4CAF50',
  },
  carbsCard: {
    borderLeftColor: '#2196F3',
  },
  fatCard: {
    borderLeftColor: '#9C27B0',
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  macroValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  macroUnit: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  macroPercentage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  transparencyContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transparencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  calculationStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#FFF9E6',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tipBullet: {
    fontSize: 16,
    color: '#FF9800',
    marginRight: 10,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});

export default MacroResultScreen;
