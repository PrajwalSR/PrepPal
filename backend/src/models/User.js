const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    fitnessGoal: {
      type: String,
      enum: ['lose_weight', 'maintain', 'gain_muscle', 'gain_weight'],
      default: 'maintain',
    },
    stats: {
      age: { type: Number },
      gender: { type: String, enum: ['male', 'female', 'other'] },
      height: { type: Number }, // in cm
      weight: { type: Number }, // in kg
      activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
        default: 'moderate',
      },
    },
    macros: {
      calories: { type: Number },
      protein: { type: Number }, // in grams
      carbs: { type: Number }, // in grams
      fat: { type: Number }, // in grams
    },
    dietaryPreferences: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'none'],
      default: ['none'],
    },
    allergies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate macros based on stats and fitness goal
userSchema.methods.calculateMacros = function () {
  if (!this.stats.weight || !this.stats.height || !this.stats.age) {
    return null;
  }

  // Simple BMR calculation (Mifflin-St Jeor Equation)
  let bmr;
  if (this.stats.gender === 'male') {
    bmr = 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age + 5;
  } else {
    bmr = 10 * this.stats.weight + 6.25 * this.stats.height - 5 * this.stats.age - 161;
  }

  // Activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * (activityMultipliers[this.stats.activityLevel] || 1.55);

  // Adjust based on fitness goal
  let calories = tdee;
  switch (this.fitnessGoal) {
    case 'lose_weight':
      calories = tdee * 0.8; // 20% deficit
      break;
    case 'gain_muscle':
    case 'gain_weight':
      calories = tdee * 1.1; // 10% surplus
      break;
    default:
      calories = tdee;
  }

  // Macro distribution (40/30/30 - protein/carbs/fat)
  const protein = (calories * 0.3) / 4;
  const carbs = (calories * 0.4) / 4;
  const fat = (calories * 0.3) / 9;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
  };
};

module.exports = mongoose.model('User', userSchema);
