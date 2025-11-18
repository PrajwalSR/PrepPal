const express = require('express');
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  extractFromYouTube,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Search route (must be before /:id route)
router.get('/search', searchRecipes);

// Extract from YouTube
router.post('/extract-youtube', extractFromYouTube);

// Main CRUD routes
router.route('/').get(getRecipes).post(createRecipe);

router.route('/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;
