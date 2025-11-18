const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a recipe name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
        },
      },
    ],
    instructions: [
      {
        step: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    macros: {
      calories: {
        type: Number,
        required: true,
      },
      protein: {
        type: Number,
        required: true,
      },
      carbs: {
        type: Number,
        required: true,
      },
      fat: {
        type: Number,
        required: true,
      },
      fiber: {
        type: Number,
        default: 0,
      },
    },
    servings: {
      type: Number,
      required: true,
      default: 1,
    },
    prepTime: {
      type: Number, // in minutes
    },
    cookTime: {
      type: Number, // in minutes
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    dietaryInfo: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'low-carb', 'high-protein'],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching recipes
recipeSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Method to calculate macros per serving
recipeSchema.methods.getMacrosPerServing = function () {
  return {
    calories: Math.round(this.macros.calories / this.servings),
    protein: Math.round(this.macros.protein / this.servings),
    carbs: Math.round(this.macros.carbs / this.servings),
    fat: Math.round(this.macros.fat / this.servings),
    fiber: Math.round(this.macros.fiber / this.servings),
  };
};

module.exports = mongoose.model('Recipe', recipeSchema);
