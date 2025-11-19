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

// Public routes (no authentication required - for prototyping)
// Extract from YouTube - changed route to match controller comment
router.post('/extract-from-youtube', extractFromYouTube);

// Protected routes (authentication required)
router.use(protect);

// Search route (must be before /:id route)
router.get('/search', searchRecipes);

// Main CRUD routes
router.route('/').get(getRecipes).post(createRecipe);

router.route('/:id').get(getRecipe).put(updateRecipe).delete(deleteRecipe);

module.exports = router;
