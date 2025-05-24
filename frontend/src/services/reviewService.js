// Service to handle review-related API calls

const API_URL = "http://localhost:8080/api/reviews"; // Adjust if backend runs elsewhere

const createReview = async (apiClient, reviewData) => {
  try {
    const response = await apiClient.post(API_URL, reviewData);
    return response.data;
  } catch (error) {
    console.error("Create review API error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to create review");
  }
};

const getReviewsBySessionId = async (apiClient, sessionId) => {
  try {
    const response = await apiClient.get(`${API_URL}/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error(`Get reviews for session ${sessionId} API error:`, error.response?.data || error.message);
    if (error.response?.status === 404) {
      return [];
    }
    throw new Error(error.response?.data || "Failed to fetch reviews");
  }
};

const updateReview = async (apiClient, id, reviewData) => {
  try {
    const response = await apiClient.put(`${API_URL}/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Update review ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to update review");
  }
};

const deleteReview = async (apiClient, id) => {
  try {
    await apiClient.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Delete review ${id} API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data || "Failed to delete review");
  }
};

const reviewService = {
  createReview,
  getReviewsBySessionId,
  updateReview,
  deleteReview,
};

export default reviewService;

