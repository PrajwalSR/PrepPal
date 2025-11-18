const MealPlan = require('../models/MealPlan');

// @desc    Get all meal plans for current user
// @route   GET /api/meal-plans
// @access  Private
exports.getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ userId: req.user.id })
      .populate('days.meals.recipe')
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: mealPlans.length,
      mealPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plans',
      error: error.message,
    });
  }
};

// @desc    Get single meal plan
// @route   GET /api/meal-plans/:id
// @access  Private
exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate('days.meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    // Check ownership
    if (mealPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this meal plan',
      });
    }

    res.status(200).json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plan',
      error: error.message,
    });
  }
};

// @desc    Create meal plan
// @route   POST /api/meal-plans
// @access  Private
exports.createMealPlan = async (req, res) => {
  try {
    const mealPlanData = {
      ...req.body,
      userId: req.user.id,
    };

    const mealPlan = await MealPlan.create(mealPlanData);

    res.status(201).json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating meal plan',
      error: error.message,
    });
  }
};

// @desc    Update meal plan
// @route   PUT /api/meal-plans/:id
// @access  Private
exports.updateMealPlan = async (req, res) => {
  try {
    let mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    // Check ownership
    if (mealPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this meal plan',
      });
    }

    mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('days.meals.recipe');

    res.status(200).json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating meal plan',
      error: error.message,
    });
  }
};

// @desc    Delete meal plan
// @route   DELETE /api/meal-plans/:id
// @access  Private
exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found',
      });
    }

    // Check ownership
    if (mealPlan.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal plan',
      });
    }

    await mealPlan.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meal plan deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting meal plan',
      error: error.message,
    });
  }
};

// @desc    Get current week's meal plan
// @route   GET /api/meal-plans/current-week
// @access  Private
exports.getCurrentWeekPlan = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mealPlan = await MealPlan.findOne({
      userId: req.user.id,
      startDate: { $lte: today },
      endDate: { $gte: today },
      isActive: true,
    }).populate('days.meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'No active meal plan found for current week',
      });
    }

    res.status(200).json({
      success: true,
      mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching current week meal plan',
      error: error.message,
    });
  }
};
