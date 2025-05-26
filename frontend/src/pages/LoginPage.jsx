import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      const response = await authService.login(email, password);
      const token = response.token;
      if (!token) {
        throw new Error('Token não recebido do servidor.');
      }
      login(token);
      navigate('/dashboard');
    } catch (err) {
      // Log detailed error information for debugging
      console.error("Login failed raw error:", err);
      console.error("Login failed error message:", err.message);
      console.error("Login failed error response:", err.response);
      console.error("Login failed error response data:", err.response?.data);
      console.error("Login failed error response data error field:", err.response?.data?.error);

      // Extract error message string robustly
      let errorMessage = 'Falha no login. Verifique seu email e senha.'; // Default message
      if (err.response?.data?.error && typeof err.response.data.error === 'string') {
          errorMessage = err.response.data.error;
      } else if (err.message && typeof err.message === 'string') {
          // Use err.message only if it's a string and not the generic Axios error message
          if (!err.message.startsWith('Request failed with status code')) {
             errorMessage = err.message;
          }
      } else if (typeof err === 'string') {
          errorMessage = err;
      }

      console.log("Setting error display message to:", errorMessage); // Log the final message being set
      setError(errorMessage); // Ensure errorMessage is always a string
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.svg" alt="DevLoop Logo" className="h-12 mx-auto" />
          </Link>
        </div>

        {/* Login Card */}
        <div className="card border-l-4 border-primary">
          <h2 className="text-2xl font-bold mb-6 font-display text-center">Bem-vindo de volta</h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
              {/* Display the error message (already ensured to be string) */}
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="form-label">Senha</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted mt-8 text-sm">
          © 2025 DevLoop. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

