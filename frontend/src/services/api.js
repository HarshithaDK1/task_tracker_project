import axios from "axios";

const API_BASE_URL = "http://localhost:8001";

const api = {
  // Get all tasks with optional status filter
  getTasks: async (status = "", priority = "") => {
    try {
      const params = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;

      const response = await axios.get(`${API_BASE_URL}/tasks`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, updates) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${taskId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  // Get insights
  getInsights: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/insights`);
      return response.data;
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }
  },
};

export default api;
