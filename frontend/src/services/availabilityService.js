// Service to handle availability-related API calls

const API_URL = "http://localhost:8080/api/availabilities"; // Adjust if backend runs elsewhere

const createAvailability = async (apiClient, availabilityData) => {
  // availabilityData should be { start: ISO_STRING, end: ISO_STRING }
  try {
    const response = await apiClient.post(API_URL, availabilityData);
    return response.data;
  } catch (error) {
    console.error("Create availability API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to create availability");
  }
};

const getAvailabilities = async (apiClient, mentorId = null) => {
  try {
    const params = mentorId ? { mentorId } : {};
    const response = await apiClient.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error("Get availabilities API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to fetch availabilities");
  }
};

// Add delete availability function if needed

const availabilityService = {
  createAvailability,
  getAvailabilities,
};

export default availabilityService;

