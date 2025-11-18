import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMealPlan as generateMealPlanUtil, calculateMealPlanMacros } from '../utils/mealPlanGenerator';

const MEAL_PLANS_KEY = 'mealPlans';
const RECIPES_KEY = 'recipes';

const generateId = () => {
  return `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMealPlan = async (config) => {
  try {
    const { days, mealsPerDay, targetMacros, dietaryPreferences, allergies } = config;
    const recipes = await getRecipes();
    
    if (!recipes || recipes.length === 0) {
      throw new Error('No recipes available. Please add recipes first.');
    }

    const mealPlanData = generateMealPlanUtil(recipes, days, mealsPerDay, targetMacros, dietaryPreferences, allergies);
    const dailyMacros = calculateMealPlanMacros(mealPlanData.meals);
    const groceryList = generateGroceryList(mealPlanData.meals);
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days - 1);

    return {
      id: generateId(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      days,
      mealsPerDay,
      targetMacros,
      meals: mealPlanData.meals,
      dailyMacros,
      groceryList,
      createdAt: new Date().toISOString(),
      isActive: false,
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
};

export const saveMealPlan = async (mealPlan) => {
  try {
    const existingPlans = await getAllMealPlans();
    if (mealPlan.isActive) {
      existingPlans.forEach((plan) => { plan.isActive = false; });
    }
    
    const planIndex = existingPlans.findIndex((p) => p.id === mealPlan.id);
    if (planIndex >= 0) {
      existingPlans[planIndex] = mealPlan;
    } else {
      existingPlans.push(mealPlan);
    }
    
    await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(existingPlans));
    return mealPlan;
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
};

export const getAllMealPlans = async () => {
  try {
    const plansJson = await AsyncStorage.getItem(MEAL_PLANS_KEY);
    if (!plansJson) return [];
    const plans = JSON.parse(plansJson);
    plans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return plans;
  } catch (error) {
    console.error('Error getting meal plans:', error);
    return [];
  }
};

export const getMealPlanById = async (id) => {
  try {
    const plans = await getAllMealPlans();
    return plans.find((plan) => plan.id === id) || null;
  } catch (error) {
    console.error('Error getting meal plan by ID:', error);
    return null;
  }
};

export const getActiveMealPlan = async () => {
  try {
    const plans = await getAllMealPlans();
    return plans.find((plan) => plan.isActive) || null;
  } catch (error) {
    console.error('Error getting active meal plan:', error);
    return null;
  }
};

export const updateMealPlan = async (id, updates) => {
  try {
    const plans = await getAllMealPlans();
    const planIndex = plans.findIndex((p) => p.id === id);
    if (planIndex < 0) throw new Error('Meal plan not found');
    
    plans[planIndex] = { ...plans[planIndex], ...updates };
    
    if (updates.meals) {
      const dailyMacros = calculateMealPlanMacros(updates.meals);
      plans[planIndex].dailyMacros = dailyMacros;
      const groceryList = generateGroceryList(updates.meals);
      plans[planIndex].groceryList = groceryList;
    }
    
    await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
    return plans[planIndex];
  } catch (error) {
    console.error('Error updating meal plan:', error);
    throw error;
  }
};

export const deleteMealPlan = async (id) => {
  try {
    const plans = await getAllMealPlans();
    const filteredPlans = plans.filter((p) => p.id !== id);
    await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(filteredPlans));
    return true;
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    return false;
  }
};

export const updateGroceryItem = async (mealPlanId, category, itemIndex, checked) => {
  try {
    const plans = await getAllMealPlans();
    const planIndex = plans.findIndex((p) => p.id === mealPlanId);
    if (planIndex < 0) throw new Error('Meal plan not found');
    
    const categoryIndex = plans[planIndex].groceryList.findIndex((c) => c.category === category);
    if (categoryIndex < 0) throw new Error('Category not found');
    
    plans[planIndex].groceryList[categoryIndex].items[itemIndex].checked = checked;
    await AsyncStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
    return plans[planIndex];
  } catch (error) {
    console.error('Error updating grocery item:', error);
    throw error;
  }
};

export const generateGroceryList = (meals) => {
  const ingredientsMap = new Map();
  
  meals.forEach((meal) => {
    const recipe = meal.recipe;
    const servings = meal.servings || 1;
    const recipeServings = recipe.servings || 1;
    
    recipe.ingredients?.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase();
      
      if (ingredientsMap.has(key)) {
        const existing = ingredientsMap.get(key);
        if (existing.unit === ingredient.unit) {
          const existingQty = parseFloat(existing.quantity) || 0;
          const newQty = parseFloat(ingredient.amount) || 0;
          const scaledQty = (newQty / recipeServings) * servings;
          existing.quantity = (existingQty + scaledQty).toFixed(1);
        } else {
          existing.quantity += `, ${ingredient.amount} ${ingredient.unit || ''}`.trim();
        }
      } else {
        const qty = parseFloat(ingredient.amount) || 0;
        const scaledQty = (qty / recipeServings) * servings;
        ingredientsMap.set(key, {
          name: ingredient.name,
          quantity: scaledQty.toFixed(1),
          unit: ingredient.unit || '',
          checked: false,
        });
      }
    });
  });
  
  const categories = {
    Proteins: [],
    Vegetables: [],
    'Grains & Carbs': [],
    Dairy: [],
    Fruits: [],
    'Pantry & Spices': [],
    Other: [],
  };
  
  ingredientsMap.forEach((ingredient) => {
    const name = ingredient.name.toLowerCase();
    let category = 'Other';
    
    if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || name.includes('fish') || name.includes('salmon') || name.includes('tuna') || name.includes('turkey') || name.includes('tofu') || name.includes('egg') || name.includes('shrimp')) {
      category = 'Proteins';
    } else if (name.includes('broccoli') || name.includes('spinach') || name.includes('lettuce') || name.includes('carrot') || name.includes('tomato') || name.includes('pepper') || name.includes('onion') || name.includes('garlic') || name.includes('cucumber') || name.includes('zucchini') || name.includes('mushroom') || name.includes('kale')) {
      category = 'Vegetables';
    } else if (name.includes('rice') || name.includes('pasta') || name.includes('bread') || name.includes('oat') || name.includes('quinoa') || name.includes('potato') || name.includes('sweet potato') || name.includes('tortilla')) {
      category = 'Grains & Carbs';
    } else if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || name.includes('butter') || name.includes('cream')) {
      category = 'Dairy';
    } else if (name.includes('apple') || name.includes('banana') || name.includes('orange') || name.includes('berry') || name.includes('strawberry') || name.includes('blueberry') || name.includes('mango') || name.includes('pineapple')) {
      category = 'Fruits';
    } else if (name.includes('salt') || name.includes('pepper') || name.includes('oil') || name.includes('vinegar') || name.includes('sauce') || name.includes('spice') || name.includes('herb') || name.includes('seasoning') || name.includes('cumin') || name.includes('paprika')) {
      category = 'Pantry & Spices';
    }
    
    categories[category].push(ingredient);
  });
  
  const getCategoryIcon = (cat) => {
    const icons = { Proteins: '🥩', Vegetables: '🥦', 'Grains & Carbs': '🌾', Dairy: '🥛', Fruits: '🍎', 'Pantry & Spices': '🧂', Other: '📦' };
    return icons[cat] || '📦';
  };
  
  return Object.entries(categories)
    .filter(([_, items]) => items.length > 0)
    .map(([category, items]) => ({
      category,
      icon: getCategoryIcon(category),
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
};

export const getRecipes = async () => {
  try {
    const recipesJson = await AsyncStorage.getItem(RECIPES_KEY);
    if (recipesJson) return JSON.parse(recipesJson);
    return [];
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

export const saveRecipes = async (recipes) => {
  try {
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error('Error saving recipes:', error);
    return false;
  }
};

export default {
  generateMealPlan,
  saveMealPlan,
  getAllMealPlans,
  getMealPlanById,
  getActiveMealPlan,
  updateMealPlan,
  deleteMealPlan,
  updateGroceryItem,
  generateGroceryList,
  getRecipes,
  saveRecipes,
};
