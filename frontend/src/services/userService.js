import { useAuth } from "../contexts/AuthContext";

const getUsers = async (apiClient, params = {}) => {
  try {
    const response = await apiClient.get("/api/users", { params });
    return response.data;
  } catch (error) {
    console.error("Get users API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch users");
  }
};

const getUserById = async (apiClient, id) => {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get user ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch user");
  }
};

const updateUser = async (apiClient, id, userData) => {
    try {
        const response = await apiClient.put(`/api/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Update user ${id} API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data || "Failed to update user");
    }
};

// Add other user-related functions (create, delete) if needed based on frontend requirements

const userService = {
  getUsers,
  getUserById,
  updateUser,
};

export default userService;

