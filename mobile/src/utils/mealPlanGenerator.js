/**
 * Meal Plan Generator Utility
 * Core algorithm for generating balanced meal plans
 */

/**
 * Generate a meal plan based on user preferences and available recipes
 * @param {Array} recipes - Available recipes
 * @param {Number} days - Number of days for meal plan
 * @param {Number} mealsPerDay - Number of meals per day
 * @param {Object} targetMacros - Target daily macros {calories, protein, carbs, fat}
 * @param {Array} dietaryPreferences - User's dietary preferences
 * @param {Array} allergies - User's allergies
 * @returns {Object} Generated meal plan
 */
export const generateMealPlan = (
  recipes,
  days,
  mealsPerDay,
  targetMacros,
  dietaryPreferences = [],
  allergies = []
) => {
  // Step 1: Filter recipes based on dietary preferences and allergies
  const filteredRecipes = filterRecipesByPreferences(recipes, dietaryPreferences, allergies);

  if (filteredRecipes.length < days * mealsPerDay) {
    throw new Error(
      `Not enough recipes. Need at least ${days * mealsPerDay} recipes, but only have ${filteredRecipes.length}`
    );
  }

  // Step 2: Determine meal types based on mealsPerDay
  const mealTypes = getMealTypes(mealsPerDay);

  // Step 3: Calculate target macros per meal
  const macrosPerMeal = {
    calories: Math.round(targetMacros.calories / mealsPerDay),
    protein: Math.round(targetMacros.protein / mealsPerDay),
    carbs: Math.round(targetMacros.carbs / mealsPerDay),
    fat: Math.round(targetMacros.fat / mealsPerDay),
  };

  // Step 4: Generate meals for each day
  const meals = [];
  const usedRecipeIds = new Set();

  for (let day = 1; day <= days; day++) {
    const dayRecipeIds = new Set(); // Don't repeat recipes within same day

    for (let mealIndex = 0; mealIndex < mealsPerDay; mealIndex++) {
      const mealType = mealTypes[mealIndex];

      // Find best recipe for this meal
      const recipe = selectBestRecipe(
        filteredRecipes,
        macrosPerMeal,
        usedRecipeIds,
        dayRecipeIds,
        mealType
      );

      if (recipe) {
        meals.push({
          day,
          mealType,
          recipe,
          servings: 1,
        });

        dayRecipeIds.add(recipe.id);
        // Don't add to usedRecipeIds immediately - allow some repetition across days
        // Only mark as used if we've used it in last 2 days
        if (day > 2) {
          usedRecipeIds.add(recipe.id);
        }
      }
    }

    // Clear some used recipes to allow repetition
    if (day % 3 === 0) {
      usedRecipeIds.clear();
    }
  }

  return {
    days,
    mealsPerDay,
    targetMacros,
    meals,
  };
};

/**
 * Filter recipes based on dietary preferences and allergies
 */
const filterRecipesByPreferences = (recipes, dietaryPreferences, allergies) => {
  return recipes.filter((recipe) => {
    // Check dietary preferences
    if (dietaryPreferences && dietaryPreferences.length > 0) {
      // If user has no restrictions, include all
      if (dietaryPreferences.includes('none')) {
        // Continue to allergy check
      } else {
        // Check if recipe matches any dietary preference
        const hasMatchingPreference = dietaryPreferences.some((pref) =>
          recipe.dietaryInfo?.includes(pref)
        );
        // If recipe has no dietary info, include it (assume flexible)
        if (recipe.dietaryInfo && recipe.dietaryInfo.length > 0 && !hasMatchingPreference) {
          return false;
        }
      }
    }

    // Check allergies
    if (allergies && allergies.length > 0 && !allergies.includes('none')) {
      const hasAllergen = recipe.ingredients?.some((ingredient) =>
        allergies.some((allergy) => ingredient.name.toLowerCase().includes(allergy.toLowerCase()))
      );
      if (hasAllergen) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Get meal types based on meals per day
 */
const getMealTypes = (mealsPerDay) => {
  switch (mealsPerDay) {
    case 2:
      return ['Breakfast', 'Dinner'];
    case 3:
      return ['Breakfast', 'Lunch', 'Dinner'];
    case 4:
      return ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    default:
      return ['Breakfast', 'Lunch', 'Dinner'];
  }
};

/**
 * Select best recipe for a meal based on macro targets
 */
const selectBestRecipe = (recipes, targetMacros, usedRecipeIds, dayRecipeIds, mealType) => {
  // Filter out used recipes
  const availableRecipes = recipes.filter(
    (recipe) => !usedRecipeIds.has(recipe.id) && !dayRecipeIds.has(recipe.id)
  );

  if (availableRecipes.length === 0) {
    // If no unused recipes, use any recipe not in today
    const fallbackRecipes = recipes.filter((recipe) => !dayRecipeIds.has(recipe.id));
    if (fallbackRecipes.length === 0) {
      return recipes[Math.floor(Math.random() * recipes.length)];
    }
    return fallbackRecipes[Math.floor(Math.random() * fallbackRecipes.length)];
  }

  // Score each recipe based on how close it is to target macros
  const scoredRecipes = availableRecipes.map((recipe) => {
    const macros = recipe.macros || {};
    const caloriesDiff = Math.abs(macros.calories - targetMacros.calories);
    const proteinDiff = Math.abs(macros.protein - targetMacros.protein);
    const carbsDiff = Math.abs(macros.carbs - targetMacros.carbs);
    const fatDiff = Math.abs(macros.fat - targetMacros.fat);

    // Weight protein more heavily for fitness goals
    const score = caloriesDiff + proteinDiff * 2 + carbsDiff + fatDiff;

    return { recipe, score };
  });

  // Sort by score (lower is better)
  scoredRecipes.sort((a, b) => a.score - b.score);

  // Return best match (or random from top 3 for variety)
  const topRecipes = scoredRecipes.slice(0, Math.min(3, scoredRecipes.length));
  const randomIndex = Math.floor(Math.random() * topRecipes.length);

  return topRecipes[randomIndex].recipe;
};

/**
 * Calculate total macros for a meal plan
 * @param {Array} meals - Array of meal objects
 * @returns {Object} Daily macro totals
 */
export const calculateMealPlanMacros = (meals) => {
  const dailyTotals = {};

  meals.forEach((meal) => {
    const day = meal.day;

    if (!dailyTotals[day]) {
      dailyTotals[day] = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    const macros = meal.recipe.macros || {};
    const servings = meal.servings || 1;
    const recipeServings = meal.recipe.servings || 1;

    dailyTotals[day].calories += Math.round((macros.calories / recipeServings) * servings);
    dailyTotals[day].protein += Math.round((macros.protein / recipeServings) * servings);
    dailyTotals[day].carbs += Math.round((macros.carbs / recipeServings) * servings);
    dailyTotals[day].fat += Math.round((macros.fat / recipeServings) * servings);
  });

  return dailyTotals;
};

/**
 * Find swap options for a meal
 * @param {Object} currentMeal - Current meal to swap
 * @param {Array} allRecipes - All available recipes
 * @param {Array} usedRecipeIds - IDs of recipes already in meal plan
 * @param {Array} dietaryPreferences - User dietary preferences
 * @param {Array} allergies - User allergies
 * @returns {Array} Sorted array of swap options
 */
export const findSwapOptions = (
  currentMeal,
  allRecipes,
  usedRecipeIds,
  dietaryPreferences,
  allergies
) => {
  // Filter recipes
  const filteredRecipes = filterRecipesByPreferences(allRecipes, dietaryPreferences, allergies);

  // Exclude current recipe and already used recipes in the plan
  const availableRecipes = filteredRecipes.filter(
    (recipe) => recipe.id !== currentMeal.recipe.id && !usedRecipeIds.includes(recipe.id)
  );

  // Get current meal macros
  const currentMacros = currentMeal.recipe.macros;

  // Score recipes by macro similarity (within ±20%)
  const swapOptions = availableRecipes
    .map((recipe) => {
      const macros = recipe.macros || {};

      // Calculate percentage differences
      const caloriesDiff = Math.abs(macros.calories - currentMacros.calories);
      const proteinDiff = Math.abs(macros.protein - currentMacros.protein);
      const carbsDiff = Math.abs(macros.carbs - currentMacros.carbs);
      const fatDiff = Math.abs(macros.fat - currentMacros.fat);

      const caloriesPct = (caloriesDiff / currentMacros.calories) * 100;
      const proteinPct = (proteinDiff / currentMacros.protein) * 100;
      const carbsPct = (carbsDiff / currentMacros.carbs) * 100;
      const fatPct = (fatDiff / currentMacros.fat) * 100;

      // Only include if within ±30% for all macros
      if (caloriesPct > 30 || proteinPct > 30 || carbsPct > 30 || fatPct > 30) {
        return null;
      }

      // Calculate similarity score (lower is better)
      const score = caloriesDiff + proteinDiff * 2 + carbsDiff + fatDiff;

      return {
        recipe,
        score,
        macroDiff: {
          calories: macros.calories - currentMacros.calories,
          protein: macros.protein - currentMacros.protein,
          carbs: macros.carbs - currentMacros.carbs,
          fat: macros.fat - currentMacros.fat,
        },
      };
    })
    .filter((option) => option !== null)
    .sort((a, b) => a.score - b.score);

  return swapOptions;
};

/**
 * Calculate macro accuracy compared to target
 * @param {Number} actual - Actual macro value
 * @param {Number} target - Target macro value
 * @returns {String} Color code: 'green', 'yellow', or 'red'
 */
export const getMacroAccuracy = (actual, target) => {
  const diff = Math.abs(actual - target);
  const percentage = (diff / target) * 100;

  if (percentage <= 5) return 'green';
  if (percentage <= 10) return 'yellow';
  return 'red';
};

/**
 * Get overall day accuracy
 */
export const getDayAccuracy = (dailyMacros, targetMacros) => {
  const calorieAccuracy = getMacroAccuracy(dailyMacros.calories, targetMacros.calories);
  const proteinAccuracy = getMacroAccuracy(dailyMacros.protein, targetMacros.protein);

  // If both calories and protein are good, it's green
  if (calorieAccuracy === 'green' && proteinAccuracy === 'green') return 'green';
  // If either is red, it's red
  if (calorieAccuracy === 'red' || proteinAccuracy === 'red') return 'red';
  // Otherwise yellow
  return 'yellow';
};

export default {
  generateMealPlan,
  calculateMealPlanMacros,
  findSwapOptions,
  getMacroAccuracy,
  getDayAccuracy,
};
