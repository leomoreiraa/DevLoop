import axios from 'axios';

const API_URL = 'http://localhost:8080/auth'; // Base URL for auth endpoints

const register = async (userData) => {
  // userData should be { username, email, password, role }
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // Should return "User registered successfully"
  } catch (error) {
    console.error('Registration API error:', error.response?.data || error.message);
    throw new Error(error.response?.data || 'Registration failed');
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data; // Should return the JWT token
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    throw new Error(error.response?.data || 'Login failed');
  }
};

const authService = {
  register,
  login,
};

export default authService;

