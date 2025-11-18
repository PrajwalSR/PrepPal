// Utility helper functions

export const calculateTotalMacros = (meals) => {
  return meals.reduce(
    (total, meal) => ({
      calories: total.calories + (meal.macros?.calories || 0),
      protein: total.protein + (meal.macros?.protein || 0),
      carbs: total.carbs + (meal.macros?.carbs || 0),
      fat: total.fat + (meal.macros?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const calculateMacroPercentages = (macros) => {
  const total = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;
  return {
    protein: ((macros.protein * 4) / total) * 100,
    carbs: ((macros.carbs * 4) / total) * 100,
    fat: ((macros.fat * 9) / total) * 100,
  };
};
