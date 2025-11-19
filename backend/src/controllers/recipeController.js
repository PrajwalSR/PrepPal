const Recipe = require('../models/Recipe');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Private
exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      $or: [{ isPublic: true }, { createdBy: req.user.id }],
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message,
    });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Private
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message,
    });
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
// @access  Private
exports.createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating recipe',
      error: error.message,
    });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // Check ownership
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this recipe',
      });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating recipe',
      error: error.message,
    });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found',
      });
    }

    // Check ownership
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this recipe',
      });
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Recipe deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message,
    });
  }
};

// @desc    Search recipes
// @route   GET /api/recipes/search
// @access  Private
exports.searchRecipes = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query',
      });
    }

    const recipes = await Recipe.find({
      $text: { $search: q },
      $or: [{ isPublic: true }, { createdBy: req.user.id }],
    }).populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching recipes',
      error: error.message,
    });
  }
};

// @desc    Extract recipe from YouTube (MOCK DATA - for prototyping)
// @route   POST /api/recipes/extract-from-youtube
// @access  Public (for now, during prototyping)
exports.extractFromYouTube = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;

    // Validate URL
    if (!youtubeUrl) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a YouTube URL',
      });
    }

    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube URL',
      });
    }

    // Simulate API delay (2 seconds) to mimic real API processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock recipe based on URL (for variety)
    const mockRecipe = generateMockRecipe(youtubeUrl);

    return res.status(200).json({
      success: true,
      data: mockRecipe,
      message: 'Recipe extracted successfully (MOCK DATA)',
    });
  } catch (error) {
    console.error('Error extracting recipe:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract recipe',
    });
  }
};

/**
 * Generate mock recipe data based on URL
 * Returns different recipes based on URL hash for variety
 * In production, this will be replaced with actual YouTube + OpenAI API calls
 */
function generateMockRecipe(url) {
  const mockRecipes = [
    {
      recipe_name: 'High Protein Chicken & Rice Meal Prep',
      servings: 5,
      ingredients: [
        { item: 'Chicken breast', quantity: '1', unit: 'kg' },
        { item: 'Brown rice', quantity: '2', unit: 'cups' },
        { item: 'Broccoli', quantity: '500', unit: 'g' },
        { item: 'Olive oil', quantity: '2', unit: 'tbsp' },
        { item: 'Garlic powder', quantity: '1', unit: 'tsp' },
        { item: 'Salt', quantity: '1', unit: 'tsp' },
        { item: 'Black pepper', quantity: '0.5', unit: 'tsp' },
      ],
      instructions: [
        'Preheat oven to 200°C (400°F)',
        'Season chicken breasts with salt, pepper, and garlic powder',
        'Bake chicken for 25-30 minutes until internal temp reaches 75°C',
        'Cook rice according to package instructions',
        'Steam broccoli for 5-7 minutes until tender',
        'Let chicken rest for 5 minutes, then slice',
        'Divide into 5 meal prep containers: chicken, rice, and broccoli',
        'Drizzle with olive oil before sealing',
      ],
      macros_per_serving: {
        calories: 420,
        protein: 45,
        carbs: 38,
        fat: 9,
      },
      prep_time_minutes: 15,
      cook_time_minutes: 35,
      cuisine_type: 'American',
      allergens: [],
    },
    {
      recipe_name: 'Vegetarian Buddha Bowl Meal Prep',
      servings: 4,
      ingredients: [
        { item: 'Quinoa', quantity: '1.5', unit: 'cups' },
        { item: 'Chickpeas (canned)', quantity: '2', unit: 'cans' },
        { item: 'Sweet potato', quantity: '2', unit: 'large' },
        { item: 'Kale', quantity: '200', unit: 'g' },
        { item: 'Tahini', quantity: '4', unit: 'tbsp' },
        { item: 'Lemon', quantity: '2', unit: 'whole' },
        { item: 'Cumin', quantity: '1', unit: 'tsp' },
        { item: 'Olive oil', quantity: '2', unit: 'tbsp' },
      ],
      instructions: [
        'Preheat oven to 220°C (425°F)',
        'Cube sweet potatoes and toss with olive oil and cumin',
        'Roast sweet potatoes for 25-30 minutes until tender',
        'Cook quinoa according to package directions',
        'Drain and rinse chickpeas',
        'Massage kale with lemon juice',
        'Make tahini dressing: mix tahini, lemon juice, and water',
        'Assemble bowls: quinoa, roasted sweet potato, chickpeas, kale',
        'Store dressing separately in small containers',
      ],
      macros_per_serving: {
        calories: 385,
        protein: 15,
        carbs: 58,
        fat: 12,
      },
      prep_time_minutes: 20,
      cook_time_minutes: 30,
      cuisine_type: 'Mediterranean',
      allergens: ['gluten'],
    },
    {
      recipe_name: 'Spicy Korean Beef & Veggie Bowls',
      servings: 6,
      ingredients: [
        { item: 'Ground beef', quantity: '800', unit: 'g' },
        { item: 'Jasmine rice', quantity: '2', unit: 'cups' },
        { item: 'Bell peppers', quantity: '3', unit: 'whole' },
        { item: 'Carrots', quantity: '2', unit: 'large' },
        { item: 'Soy sauce', quantity: '4', unit: 'tbsp' },
        { item: 'Gochujang', quantity: '2', unit: 'tbsp' },
        { item: 'Sesame oil', quantity: '2', unit: 'tsp' },
        { item: 'Green onions', quantity: '4', unit: 'stalks' },
        { item: 'Garlic', quantity: '4', unit: 'cloves' },
      ],
      instructions: [
        'Cook rice according to package instructions',
        'Brown ground beef in large pan, breaking it up as it cooks',
        'Slice bell peppers and carrots into thin strips',
        'Add minced garlic to beef, cook 1 minute',
        'Add vegetables to beef, stir fry for 5 minutes',
        'Mix soy sauce, gochujang, and sesame oil in small bowl',
        'Add sauce to beef mixture, cook 2 more minutes',
        'Portion rice into containers',
        'Top with beef and veggie mixture',
        'Garnish with sliced green onions',
      ],
      macros_per_serving: {
        calories: 445,
        protein: 32,
        carbs: 42,
        fat: 16,
      },
      prep_time_minutes: 15,
      cook_time_minutes: 25,
      cuisine_type: 'Asian',
      allergens: ['soy'],
    },
  ];

  // Use URL length to deterministically select a recipe (for consistency)
  const hash = url.length % mockRecipes.length;
  return mockRecipes[hash];
}
