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
    // Return the success message from the backend response
    return response.data; // Expects { message: "User registered successfully" }
  } catch (error) {
    console.error('Registration API error:', error.response?.data || error.message);
    // Extract the specific error message from backend or provide a default
    const errorMessage = error.response?.data?.error || 'Falha no registro. Tente novamente.';
    throw new Error(errorMessage);
  }
};

const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
    // Return the full response data which should contain the token
    return response.data; // Expects { token: "..." }
  } catch (error) {
    console.error('Login API error:', error.response?.data || error.message);
    // Extract the specific error message from backend or provide a default
    const errorMessage = error.response?.data?.error || 'Falha no login. Verifique seu email e senha.';
    throw new Error(errorMessage); // Throw an error with the extracted string message
  }
};

const authService = {
  register,
  login,
};

export default authService;

