import apiService from './apiService';

// Example service demonstrating API service usage
export const exampleService = {
  // Get all items
  getAllItems: async () => {
    try {
      return await apiService.get('/items');
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  },

  // Get item by ID
  getItemById: async (id) => {
    try {
      return await apiService.get(`/items/${id}`);
    } catch (error) {
      console.error(`Error fetching item ${id}:`, error);
      throw error;
    }
  },

  // Create new item
  createItem: async (itemData) => {
    try {
      return await apiService.post('/items', itemData);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (id, itemData) => {
    try {
      return await apiService.put(`/items/${id}`, itemData);
    } catch (error) {
      console.error(`Error updating item ${id}:`, error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (id) => {
    try {
      return await apiService.delete(`/items/${id}`);
    } catch (error) {
      console.error(`Error deleting item ${id}:`, error);
      throw error;
    }
  },
};

export default exampleService;