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

// @desc    Extract recipe from YouTube
// @route   POST /api/recipes/extract-youtube
// @access  Private
exports.extractFromYouTube = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a YouTube URL',
      });
    }

    // TODO: Implement OpenAI API call to extract recipe from YouTube video
    // This is a placeholder for future implementation

    res.status(200).json({
      success: true,
      message: 'YouTube extraction feature coming soon',
      youtubeUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error extracting recipe from YouTube',
      error: error.message,
    });
  }
};
