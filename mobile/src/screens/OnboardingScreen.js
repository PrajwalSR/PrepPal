import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { calculateUserMacros } from '../utils/macroCalculator';

/**
 * OnboardingScreen - Multi-step form for user profile setup
 * Collects user data and calculates macros
 */
const OnboardingScreen = ({ navigation }) => {
  const { saveUserProfile } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    age: '',
    gender: '',
    weight: '',
    height: '',

    // Step 2: Activity Level
    activityLevel: '',

    // Step 3: Fitness Goal
    fitnessGoal: '',

    // Step 4: Dietary Preferences
    dietaryPreferences: [],

    // Step 5: Allergies
    allergies: [],
  });

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle array field (for checkboxes)
  const toggleArrayField = (field, value) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  // Validation for each step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.age || !formData.gender || !formData.weight || !formData.height) {
          Alert.alert('Missing Information', 'Please fill in all fields to continue.');
          return false;
        }
        if (formData.age < 13 || formData.age > 120) {
          Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120.');
          return false;
        }
        if (formData.weight < 30 || formData.weight > 300) {
          Alert.alert('Invalid Weight', 'Please enter a valid weight between 30 and 300 kg.');
          return false;
        }
        if (formData.height < 100 || formData.height > 250) {
          Alert.alert('Invalid Height', 'Please enter a valid height between 100 and 250 cm.');
          return false;
        }
        return true;

      case 2:
        if (!formData.activityLevel) {
          Alert.alert('Missing Information', 'Please select your activity level.');
          return false;
        }
        return true;

      case 3:
        if (!formData.fitnessGoal) {
          Alert.alert('Missing Information', 'Please select your fitness goal.');
          return false;
        }
        return true;

      case 4:
        if (formData.dietaryPreferences.length === 0) {
          Alert.alert('Missing Information', 'Please select at least one dietary preference.');
          return false;
        }
        return true;

      case 5:
        if (formData.allergies.length === 0) {
          Alert.alert('Missing Information', 'Please select your allergies or choose "None".');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Handle next button
  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle final submission
  const handleCalculateMacros = async () => {
    if (!validateStep()) {
      return;
    }

    try {
      // Prepare user profile data
      const userProfile = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        activityLevel: formData.activityLevel,
        fitnessGoal: formData.fitnessGoal,
        dietaryPreferences: formData.dietaryPreferences,
        allergies: formData.allergies,
      };

      // Calculate macros
      const macros = calculateUserMacros(userProfile);

      // Save to context (and AsyncStorage)
      const result = await saveUserProfile({
        ...userProfile,
        macros,
      });

      if (result.success) {
        // Navigate to MacroResult screen
        navigation.navigate('MacroResult', { macros, userProfile });
      } else {
        Alert.alert('Error', 'Failed to save your profile. Please try again.');
      }
    } catch (error) {
      console.error('Error calculating macros:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formData={formData} updateField={updateField} />;
      case 2:
        return <Step2ActivityLevel formData={formData} updateField={updateField} />;
      case 3:
        return <Step3FitnessGoal formData={formData} updateField={updateField} />;
      case 4:
        return <Step4DietaryPreferences formData={formData} toggleArrayField={toggleArrayField} />;
      case 5:
        return <Step5Allergies formData={formData} toggleArrayField={toggleArrayField} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Step {currentStep} of {totalSteps}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(currentStep / totalSteps) * 100}%` }]} />
          </View>
        </View>

        {/* Step Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {currentStep < totalSteps ? (
            <TouchableOpacity
              style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleCalculateMacros}
              activeOpacity={0.8}
            >
              <Text style={styles.calculateButtonText}>Calculate My Macros</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// STEP 1: Basic Info
const Step1BasicInfo = ({ formData, updateField }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Let's Get to Know You</Text>
    <Text style={styles.stepDescription}>Tell us a bit about yourself</Text>

    <Text style={styles.label}>Name</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your name"
      value={formData.name}
      onChangeText={(value) => updateField('name', value)}
      autoCapitalize="words"
    />

    <Text style={styles.label}>Age</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your age"
      value={formData.age}
      onChangeText={(value) => updateField('age', value)}
      keyboardType="numeric"
    />

    <Text style={styles.label}>Gender</Text>
    <View style={styles.radioGroup}>
      <RadioButton
        label="Male"
        selected={formData.gender === 'male'}
        onPress={() => updateField('gender', 'male')}
      />
      <RadioButton
        label="Female"
        selected={formData.gender === 'female'}
        onPress={() => updateField('gender', 'female')}
      />
      <RadioButton
        label="Other"
        selected={formData.gender === 'other'}
        onPress={() => updateField('gender', 'other')}
      />
    </View>

    <Text style={styles.label}>Weight (kg)</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your weight in kg"
      value={formData.weight}
      onChangeText={(value) => updateField('weight', value)}
      keyboardType="decimal-pad"
    />

    <Text style={styles.label}>Height (cm)</Text>
    <TextInput
      style={styles.input}
      placeholder="Enter your height in cm"
      value={formData.height}
      onChangeText={(value) => updateField('height', value)}
      keyboardType="numeric"
    />
  </View>
);

// STEP 2: Activity Level
const Step2ActivityLevel = ({ formData, updateField }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Activity Level</Text>
    <Text style={styles.stepDescription}>How active are you on a weekly basis?</Text>

    <RadioButton
      label="Sedentary"
      sublabel="Little to no exercise"
      selected={formData.activityLevel === 'sedentary'}
      onPress={() => updateField('activityLevel', 'sedentary')}
    />
    <RadioButton
      label="Lightly Active"
      sublabel="Light exercise 1-3 days/week"
      selected={formData.activityLevel === 'light'}
      onPress={() => updateField('activityLevel', 'light')}
    />
    <RadioButton
      label="Moderately Active"
      sublabel="Moderate exercise 3-5 days/week"
      selected={formData.activityLevel === 'moderate'}
      onPress={() => updateField('activityLevel', 'moderate')}
    />
    <RadioButton
      label="Very Active"
      sublabel="Hard exercise 6-7 days/week"
      selected={formData.activityLevel === 'very_active'}
      onPress={() => updateField('activityLevel', 'very_active')}
    />
    <RadioButton
      label="Extremely Active"
      sublabel="Athlete or physical job"
      selected={formData.activityLevel === 'extremely_active'}
      onPress={() => updateField('activityLevel', 'extremely_active')}
    />
  </View>
);

// STEP 3: Fitness Goal
const Step3FitnessGoal = ({ formData, updateField }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Fitness Goal</Text>
    <Text style={styles.stepDescription}>What's your primary fitness goal?</Text>

    <RadioButton
      label="Lose Weight"
      sublabel="Calorie deficit for fat loss"
      selected={formData.fitnessGoal === 'lose_weight'}
      onPress={() => updateField('fitnessGoal', 'lose_weight')}
    />
    <RadioButton
      label="Maintain Weight"
      sublabel="Stay at current weight"
      selected={formData.fitnessGoal === 'maintain'}
      onPress={() => updateField('fitnessGoal', 'maintain')}
    />
    <RadioButton
      label="Gain Muscle"
      sublabel="Calorie surplus for muscle growth"
      selected={formData.fitnessGoal === 'gain_muscle'}
      onPress={() => updateField('fitnessGoal', 'gain_muscle')}
    />
  </View>
);

// STEP 4: Dietary Preferences
const Step4DietaryPreferences = ({ formData, toggleArrayField }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Dietary Preferences</Text>
    <Text style={styles.stepDescription}>Select all that apply</Text>

    <Checkbox
      label="Vegetarian"
      checked={formData.dietaryPreferences.includes('vegetarian')}
      onPress={() => toggleArrayField('dietaryPreferences', 'vegetarian')}
    />
    <Checkbox
      label="Vegan"
      checked={formData.dietaryPreferences.includes('vegan')}
      onPress={() => toggleArrayField('dietaryPreferences', 'vegan')}
    />
    <Checkbox
      label="Keto"
      checked={formData.dietaryPreferences.includes('keto')}
      onPress={() => toggleArrayField('dietaryPreferences', 'keto')}
    />
    <Checkbox
      label="Paleo"
      checked={formData.dietaryPreferences.includes('paleo')}
      onPress={() => toggleArrayField('dietaryPreferences', 'paleo')}
    />
    <Checkbox
      label="No Restrictions"
      checked={formData.dietaryPreferences.includes('none')}
      onPress={() => toggleArrayField('dietaryPreferences', 'none')}
    />
  </View>
);

// STEP 5: Allergies
const Step5Allergies = ({ formData, toggleArrayField }) => (
  <View style={styles.stepContainer}>
    <Text style={styles.stepTitle}>Allergies & Intolerances</Text>
    <Text style={styles.stepDescription}>Select all that apply</Text>

    <Checkbox
      label="Peanuts"
      checked={formData.allergies.includes('peanuts')}
      onPress={() => toggleArrayField('allergies', 'peanuts')}
    />
    <Checkbox
      label="Tree Nuts"
      checked={formData.allergies.includes('tree_nuts')}
      onPress={() => toggleArrayField('allergies', 'tree_nuts')}
    />
    <Checkbox
      label="Shellfish"
      checked={formData.allergies.includes('shellfish')}
      onPress={() => toggleArrayField('allergies', 'shellfish')}
    />
    <Checkbox
      label="Dairy"
      checked={formData.allergies.includes('dairy')}
      onPress={() => toggleArrayField('allergies', 'dairy')}
    />
    <Checkbox
      label="Gluten"
      checked={formData.allergies.includes('gluten')}
      onPress={() => toggleArrayField('allergies', 'gluten')}
    />
    <Checkbox
      label="Soy"
      checked={formData.allergies.includes('soy')}
      onPress={() => toggleArrayField('allergies', 'soy')}
    />
    <Checkbox
      label="Eggs"
      checked={formData.allergies.includes('eggs')}
      onPress={() => toggleArrayField('allergies', 'eggs')}
    />
    <Checkbox
      label="None"
      checked={formData.allergies.includes('none')}
      onPress={() => toggleArrayField('allergies', 'none')}
    />
  </View>
);

// Reusable Components
const RadioButton = ({ label, sublabel, selected, onPress }) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.radioCircle}>{selected && <View style={styles.radioSelected} />}</View>
    <View style={styles.radioLabelContainer}>
      <Text style={styles.radioLabel}>{label}</Text>
      {sublabel && <Text style={styles.radioSublabel}>{sublabel}</Text>}
    </View>
  </TouchableOpacity>
);

const Checkbox = ({ label, checked, onPress }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkboxIcon}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  radioLabelContainer: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  radioSublabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calculateButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
