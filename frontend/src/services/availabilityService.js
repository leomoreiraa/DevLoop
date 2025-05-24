// Service to handle availability-related API calls

const API_URL = "http://localhost:8080/api/availabilities"; // Adjust if backend runs elsewhere

/**
 * Converte timeSlots para objetos de data ISO
 * @param {string} dayOfWeek - Dia da semana (MONDAY, TUESDAY, etc)
 * @param {Array<string>} timeSlots - Array de horários no formato "HH:MM"
 * @returns {Object} Objeto com start e endTime
 */
const convertTimeSlotsToDateObjects = (dayOfWeek, timeSlots) => {
  if (!timeSlots || !timeSlots.length || !dayOfWeek) {
    return { start: null, endTime: null };
  }

  // Ordena os horários
  const sortedTimeSlots = [...timeSlots].sort();
  
  // Pega o primeiro e último horário
  const firstTimeSlot = sortedTimeSlots[0];
  const lastTimeSlot = sortedTimeSlots[sortedTimeSlots.length - 1];
  
  // Calcula a data do próximo dia da semana especificado
  const today = new Date();
  const dayOfWeekIndex = getDayOfWeekIndex(dayOfWeek);
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Ajusta para 0 = segunda, 6 = domingo
  
  let daysToAdd = dayOfWeekIndex - todayIndex;
  if (daysToAdd <= 0) daysToAdd += 7; // Se for no passado, pega a próxima semana
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysToAdd);
  
  // Cria objetos de data para o início e fim
  const startDate = new Date(targetDate);
  const [startHours, startMinutes] = firstTimeSlot.split(':').map(Number);
  startDate.setHours(startHours, startMinutes, 0, 0);
  
  const endDate = new Date(targetDate);
  const [endHours, endMinutes] = lastTimeSlot.split(':').map(Number);
  endDate.setHours(endHours, endMinutes + 30, 0, 0); // Adiciona 30 minutos ao último slot
  
  return {
    start: startDate.toISOString(),
    endTime: endDate.toISOString()
  };
};

/**
 * Converte o dia da semana para índice (0 = segunda, 6 = domingo)
 */
const getDayOfWeekIndex = (dayOfWeek) => {
  const map = {
    'MONDAY': 0,
    'TUESDAY': 1,
    'WEDNESDAY': 2,
    'THURSDAY': 3,
    'FRIDAY': 4,
    'SATURDAY': 5,
    'SUNDAY': 6
  };
  return map[dayOfWeek] || 0;
};

const createAvailability = async (apiClient, availabilityData) => {
  // Padroniza dayOfWeek para maiúsculo e em inglês
  const dayOfWeek = mapDayOfWeek(availabilityData.dayOfWeek);
  
  // Converte timeSlots para objetos de data ISO
  const { start, endTime } = convertTimeSlotsToDateObjects(dayOfWeek, availabilityData.timeSlots);
  
  // Prepara dados para envio
  const data = {
    ...availabilityData,
    dayOfWeek,
    start,
    endTime
  };
  
  console.log("Enviando para o backend (create):", data);
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
  // Padroniza dayOfWeek para maiúsculo e em inglês
  const dayOfWeek = mapDayOfWeek(availabilityData.dayOfWeek);
  
  // Converte timeSlots para objetos de data ISO
  const { start, endTime } = convertTimeSlotsToDateObjects(dayOfWeek, availabilityData.timeSlots);
  
  // Prepara dados para envio
  const data = {
    ...availabilityData,
    dayOfWeek,
    start,
    endTime
  };
  
  console.log("Enviando para o backend (update):", data);
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

