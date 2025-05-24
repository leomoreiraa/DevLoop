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
      const token = await authService.login(email, password);
      login(token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || 'Falha no login. Verifique seu email e senha.');
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
