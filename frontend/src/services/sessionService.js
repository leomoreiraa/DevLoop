// Service to handle session-related API calls

const API_URL = "http://localhost:8080/sessions"; // Base URL for session endpoints

const createSession = async (apiClient, sessionData) => {
  try {
    const response = await apiClient.post(API_URL, sessionData);
    return response.data;
  } catch (error) {
    console.error("Create session API error:", error.response?.data || error.message);
    if (error.response?.status === 400) {
      throw new Error("Não há disponibilidade para este horário ou mentor inválido.");
    }
    throw new Error(error.response?.data || "Failed to create session");
  }
};

const getSessions = async (apiClient) => {
  try {
    const response = await apiClient.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Get sessions API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch sessions");
  }
};

const getSessionById = async (apiClient, id) => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get session ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch session details");
  }
};

const updateSession = async (apiClient, id, sessionData) => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, sessionData);
    return response.data;
  } catch (error) {
    console.error(`Update session ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to update session");
  }
};

const deleteSession = async (apiClient, id) => {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Delete session ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to delete session");
  }
};

const sessionService = {
  createSession,
  getSessions, // Corrigido para bater com o uso nos componentes
  getSessionById,
  updateSession,
  deleteSession,
};

export default sessionService;

