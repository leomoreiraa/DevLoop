import { useAuth } from "../contexts/AuthContext";

// Serviço para chamadas relacionadas a usuários

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

// Endpoint para buscar o perfil do usuário autenticado
const getProfile = async (apiClient) => {
  try {
    const response = await apiClient.get("/api/users/me");
    return response.data;
  } catch (error) {
    console.error("Get profile API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch profile");
  }
};

const userService = {
  getUsers,
  getUserById,
  updateUser,
  getProfile,
};

export default userService;

