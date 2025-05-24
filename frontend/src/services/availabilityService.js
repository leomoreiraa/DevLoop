// Service to handle availability-related API calls

const API_URL = "http://localhost:8080/api/availabilities"; // Adjust if backend runs elsewhere

const createAvailability = async (apiClient, availabilityData) => {
  // Padroniza dayOfWeek para maiúsculo e em inglês, se existir
  const data = {
    ...availabilityData,
    ...(availabilityData.dayOfWeek && { dayOfWeek: mapDayOfWeek(availabilityData.dayOfWeek) }),
  };
  console.log("Enviando para o backend (create):", data); // <-- Adicionado para debug
  try {
    const response = await apiClient.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Create availability API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to create availability");
  }
};

const getAvailability = async (apiClient, mentorId = null) => {
  try {
    const params = mentorId ? { mentorId } : {};
    const response = await apiClient.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Get availability API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch availability");
  }
};

const updateAvailability = async (apiClient, availabilityId, availabilityData) => {
  // Padroniza dayOfWeek para maiúsculo e em inglês, se existir
  const data = {
    ...availabilityData,
    ...(availabilityData.dayOfWeek && { dayOfWeek: mapDayOfWeek(availabilityData.dayOfWeek) }),
  };
  console.log("Enviando para o backend (update):", data); // <-- Adicionado para debug
  try {
    const response = await apiClient.put(`${API_URL}/${availabilityId}`, data);
    return response.data;
  } catch (error) {
    console.error("Update availability API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to update availability");
  }
};

// Função utilitária para garantir que o valor enviado seja o esperado pelo backend
function mapDayOfWeek(day) {
  // Se já está em inglês e maiúsculo, retorna direto
  const valid = [
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
  ];
  if (valid.includes(day.toUpperCase())) return day.toUpperCase();

  // Se vier em português, converte
  const map = {
    "SEGUNDA": "MONDAY",
    "TERCA": "TUESDAY",
    "TERÇA": "TUESDAY",
    "QUARTA": "WEDNESDAY",
    "QUINTA": "THURSDAY",
    "SEXTA": "FRIDAY",
    "SABADO": "SATURDAY",
    "SÁBADO": "SATURDAY",
    "DOMINGO": "SUNDAY"
  };
  return map[day.toUpperCase()] || day.toUpperCase();
}

const availabilityService = {
  createAvailability,
  getAvailability,
  updateAvailability,
};

export default availabilityService;

