/**
 * Macro Calculator Utility
 * Calculates daily calorie needs and macronutrient distribution
 * based on user stats and fitness goals
 */

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * Men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 * Women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
 */
const calculateBMR = (weight, height, age, gender) => {
  const baseCalculation = 10 * weight + 6.25 * height - 5 * age;

  if (gender.toLowerCase() === 'male') {
    return baseCalculation + 5;
  } else if (gender.toLowerCase() === 'female') {
    return baseCalculation - 161;
  } else {
    // For 'other', use average of male and female
    return baseCalculation - 78;
  }
};

/**
 * Activity level multipliers
 */
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little to no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  very_active: 1.725, // Hard exercise 6-7 days/week
  extremely_active: 1.9, // Very hard exercise, physical job, or training twice per day
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR × Activity Multiplier
 */
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return bmr * multiplier;
};

/**
 * Adjust calories based on fitness goal
 */
const adjustCaloriesForGoal = (tdee, fitnessGoal) => {
  switch (fitnessGoal) {
    case 'lose_weight':
      return tdee - 500; // 500 calorie deficit for ~0.5kg/week loss
    case 'gain_muscle':
      return tdee + 300; // 300 calorie surplus for muscle gain
    case 'maintain':
    default:
      return tdee; // No adjustment for maintenance
  }
};

/**
 * Calculate macronutrient distribution
 * Returns grams of protein, carbs, and fat
 */
const calculateMacros = (calories, weight, fitnessGoal) => {
  // PROTEIN: Base on body weight and goal
  let proteinGrams;
  if (fitnessGoal === 'lose_weight') {
    proteinGrams = weight * 1.8; // Higher protein for weight loss (preserve muscle)
  } else {
    proteinGrams = weight * 2.0; // Standard for maintenance/muscle gain
  }

  // FAT: 25-30% of total calories
  const fatPercentage = 0.27; // 27% as middle ground
  const fatCalories = calories * fatPercentage;
  const fatGrams = fatCalories / 9; // 9 calories per gram of fat

  // PROTEIN CALORIES: 4 calories per gram
  const proteinCalories = proteinGrams * 4;

  // CARBS: Remaining calories
  const carbCalories = calories - proteinCalories - fatCalories;
  const carbGrams = carbCalories / 4; // 4 calories per gram of carbs

  return {
    protein: Math.round(proteinGrams),
    carbs: Math.round(carbGrams),
    fat: Math.round(fatGrams),
  };
};

/**
 * Main function to calculate all macros
 * @param {Object} userProfile - User data
 * @returns {Object} - Calculated macros and formulas used
 */
export const calculateUserMacros = (userProfile) => {
  const { weight, height, age, gender, activityLevel, fitnessGoal } = userProfile;

  // Step 1: Calculate BMR
  const bmr = calculateBMR(weight, height, age, gender);

  // Step 2: Calculate TDEE
  const tdee = calculateTDEE(bmr, activityLevel);

  // Step 3: Adjust for fitness goal
  const targetCalories = adjustCaloriesForGoal(tdee, fitnessGoal);

  // Step 4: Calculate macro distribution
  const macros = calculateMacros(targetCalories, weight, fitnessGoal);

  return {
    calories: Math.round(targetCalories),
    protein: macros.protein,
    carbs: macros.carbs,
    fat: macros.fat,
    // Include calculation details for transparency
    details: {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityMultiplier: ACTIVITY_MULTIPLIERS[activityLevel] || 1.55,
      calorieAdjustment:
        fitnessGoal === 'lose_weight' ? -500 : fitnessGoal === 'gain_muscle' ? +300 : 0,
    },
  };
};

/**
 * Get human-readable activity level description
 */
export const getActivityLevelLabel = (level) => {
  const labels = {
    sedentary: 'Sedentary (little/no exercise)',
    light: 'Lightly Active (1-3 days/week)',
    moderate: 'Moderately Active (3-5 days/week)',
    very_active: 'Very Active (6-7 days/week)',
    extremely_active: 'Extremely Active (athlete/physical job)',
  };
  return labels[level] || level;
};

/**
 * Get human-readable fitness goal description
 */
export const getFitnessGoalLabel = (goal) => {
  const labels = {
    lose_weight: 'Lose Weight',
    maintain: 'Maintain Weight',
    gain_muscle: 'Gain Muscle',
  };
  return labels[goal] || goal;
};

export default {
  calculateUserMacros,
  getActivityLevelLabel,
  getFitnessGoalLabel,
};
