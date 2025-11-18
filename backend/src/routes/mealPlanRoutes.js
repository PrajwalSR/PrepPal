const express = require('express');
const router = express.Router();
const {
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  getCurrentWeekPlan,
} = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Current week route (must be before /:id route)
router.get('/current-week', getCurrentWeekPlan);

// Main CRUD routes
router.route('/').get(getMealPlans).post(createMealPlan);

router.route('/:id').get(getMealPlan).put(updateMealPlan).delete(deleteMealPlan);

module.exports = router;
