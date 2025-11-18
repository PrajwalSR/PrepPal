const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: [
      {
        date: {
          type: Date,
          required: true,
        },
        meals: [
          {
            mealType: {
              type: String,
              enum: ['breakfast', 'lunch', 'dinner', 'snack'],
              required: true,
            },
            recipe: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Recipe',
              required: true,
            },
            servings: {
              type: Number,
              default: 1,
            },
            completed: {
              type: Boolean,
              default: false,
            },
            notes: {
              type: String,
              trim: true,
            },
          },
        ],
        totalMacros: {
          calories: { type: Number, default: 0 },
          protein: { type: Number, default: 0 },
          carbs: { type: Number, default: 0 },
          fat: { type: Number, default: 0 },
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying user's meal plans
mealPlanSchema.index({ userId: 1, startDate: -1 });

// Method to calculate total macros for a specific day
mealPlanSchema.methods.calculateDayMacros = function (dayIndex) {
  const day = this.days[dayIndex];
  if (!day) return null;

  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  day.meals.forEach((meal) => {
    if (meal.recipe && meal.recipe.macros) {
      const servingMultiplier = meal.servings || 1;
      const recipeServings = meal.recipe.servings || 1;

      totals.calories += (meal.recipe.macros.calories / recipeServings) * servingMultiplier;
      totals.protein += (meal.recipe.macros.protein / recipeServings) * servingMultiplier;
      totals.carbs += (meal.recipe.macros.carbs / recipeServings) * servingMultiplier;
      totals.fat += (meal.recipe.macros.fat / recipeServings) * servingMultiplier;
    }
  });

  return {
    calories: Math.round(totals.calories),
    protein: Math.round(totals.protein),
    carbs: Math.round(totals.carbs),
    fat: Math.round(totals.fat),
  };
};

// Method to get weekly summary
mealPlanSchema.methods.getWeeklySummary = function () {
  const summary = {
    totalDays: this.days.length,
    completedMeals: 0,
    totalMeals: 0,
    averageMacros: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  };

  this.days.forEach((day) => {
    day.meals.forEach((meal) => {
      summary.totalMeals++;
      if (meal.completed) {
        summary.completedMeals++;
      }
    });

    if (day.totalMacros) {
      summary.averageMacros.calories += day.totalMacros.calories;
      summary.averageMacros.protein += day.totalMacros.protein;
      summary.averageMacros.carbs += day.totalMacros.carbs;
      summary.averageMacros.fat += day.totalMacros.fat;
    }
  });

  if (this.days.length > 0) {
    summary.averageMacros.calories = Math.round(summary.averageMacros.calories / this.days.length);
    summary.averageMacros.protein = Math.round(summary.averageMacros.protein / this.days.length);
    summary.averageMacros.carbs = Math.round(summary.averageMacros.carbs / this.days.length);
    summary.averageMacros.fat = Math.round(summary.averageMacros.fat / this.days.length);
  }

  summary.completionRate = summary.totalMeals > 0
    ? Math.round((summary.completedMeals / summary.totalMeals) * 100)
    : 0;

  return summary;
};

module.exports = mongoose.model('MealPlan', mealPlanSchema);
