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

/**
 * Método legado para atualização completa de usuário
 * Não deve ser usado para atualização de perfil ou senha
 */
const updateUser = async (apiClient, id, userData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Update user ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to update user");
  }
};

/**
 * Método seguro para atualização apenas de campos do perfil
 * Não afeta campos sensíveis como senha ou email
 */
const updateUserProfile = async (apiClient, id, profileData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error(`Update profile ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Falha ao atualizar perfil");
  }
};

/**
 * Método específico para atualização de senha
 * Requer senha atual para validação
 */
const updateUserPassword = async (apiClient, id, passwordData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error(`Update password ${id} API error:`, error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error("Senha atual incorreta");
    }
    throw new Error(error.response?.data?.message || "Falha ao atualizar senha");
  }
};

/**
 * Método para atualizar a imagem de perfil do usuário
 * Aceita dados de imagem em base64
 */
const updateProfileImage = async (apiClient, id, imageData) => {
  try {
    const response = await apiClient.put(`/api/users/${id}/profile-image`, { imageData });
    return response.data;
  } catch (error) {
    console.error(`Update profile image ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Falha ao atualizar imagem de perfil");
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
  updateUserProfile,
  updateUserPassword,
  updateProfileImage,
  getProfile,
};

export default userService;
