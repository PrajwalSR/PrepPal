import api from './api';

export const recipeService = {
  // Get all recipes
  getAllRecipes: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Create new recipe
  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  // Extract recipe from YouTube URL
  extractFromYouTube: async (youtubeUrl) => {
    const response = await api.post('/recipes/extract-from-youtube', { youtubeUrl });
    return response.data;
  },

  // Update recipe
  updateRecipe: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  // Delete recipe
  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // Search recipes
  searchRecipes: async (query) => {
    const response = await api.get(`/recipes/search?q=${query}`);
    return response.data;
  },
};
