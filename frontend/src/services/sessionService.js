// Service to handle session-related API calls

const API_URL = "http://localhost:8080/sessions"; // Base URL for session endpoints

/**
 * Converte formato de data e hora para objeto ISO
 * @param {string} date - Data no formato YYYY-MM-DD
 * @param {string} time - Hora no formato HH:MM
 * @returns {string} Data ISO
 */
const convertToISODateTime = (date, time) => {
  if (!date || !time) return null;
  return `${date}T${time}:00`;
};

const createSession = async (apiClient, sessionData) => {
  try {
    // Prepara os dados para envio no formato esperado pelo backend
    const data = {
      ...sessionData,
      // Converte date e time para scheduledTime se necessário
      ...(sessionData.date && sessionData.time && {
        scheduledTime: convertToISODateTime(sessionData.date, sessionData.time)
      })
    };
    
    console.log("Enviando para o backend (create session):", data);
    const response = await apiClient.post(API_URL, data);
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
    
    // Processa os dados para garantir compatibilidade com o frontend
    const sessions = response.data.map(session => {
      // Extrai date e time de scheduledTime se necessário
      if (session.scheduledTime && (!session.date || !session.time)) {
        const scheduledDate = new Date(session.scheduledTime);
        return {
          ...session,
          date: scheduledDate.toISOString().split('T')[0],
          time: scheduledDate.toTimeString().slice(0, 5),
          start: session.scheduledTime,
          end: session.endTime || new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString()
        };
      }
      return session;
    });
    
    return sessions;
  } catch (error) {
    console.error("Get sessions API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch sessions");
  }
};

const getSessionById = async (apiClient, id) => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);
    
    // Processa os dados para garantir compatibilidade com o frontend
    const session = response.data;
    if (session.scheduledTime && (!session.date || !session.time)) {
      const scheduledDate = new Date(session.scheduledTime);
      return {
        ...session,
        date: scheduledDate.toISOString().split('T')[0],
        time: scheduledDate.toTimeString().slice(0, 5),
        start: session.scheduledTime,
        end: session.endTime || new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString()
      };
    }
    
    return session;
  } catch (error) {
    console.error(`Get session ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch session details");
  }
};

const updateSession = async (apiClient, id, sessionData) => {
  try {
    // Prepara os dados para envio no formato esperado pelo backend
    const data = {
      ...sessionData,
      // Converte date e time para scheduledTime se necessário
      ...(sessionData.date && sessionData.time && {
        scheduledTime: convertToISODateTime(sessionData.date, sessionData.time)
      })
    };
    
    console.log("Enviando para o backend (update session):", data);
    const response = await apiClient.put(`${API_URL}/${id}`, data);
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
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};

export default sessionService;

