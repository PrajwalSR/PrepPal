import api from './api';

export const mealPlanService = {
  // Get all meal plans for current user
  getMealPlans: async () => {
    const response = await api.get('/meal-plans');
    return response.data;
  },

  // Get meal plan by ID
  getMealPlanById: async (id) => {
    const response = await api.get(`/meal-plans/${id}`);
    return response.data;
  },

  // Create new meal plan
  createMealPlan: async (mealPlanData) => {
    const response = await api.post('/meal-plans', mealPlanData);
    return response.data;
  },

  // Update meal plan
  updateMealPlan: async (id, mealPlanData) => {
    const response = await api.put(`/meal-plans/${id}`, mealPlanData);
    return response.data;
  },

  // Delete meal plan
  deleteMealPlan: async (id) => {
    const response = await api.delete(`/meal-plans/${id}`);
    return response.data;
  },

  // Get current week's meal plan
  getCurrentWeekPlan: async () => {
    const response = await api.get('/meal-plans/current-week');
    return response.data;
  },
};
