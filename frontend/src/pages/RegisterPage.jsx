import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MENTEE' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Envie apenas os campos necessários para o backend
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role // Inclua se o backend espera esse campo
      });
      // Redirecione ou faça login automático se desejar
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans py-8 animate-fadeIn">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.svg" alt="DevLoop Logo" className="h-12 mx-auto" />
          </Link>
        </div>
        
        {/* Register Card */}
        <div className="card border-l-4 border-accent">
          <h2 className="text-2xl font-bold mb-6 font-display text-center">Crie sua conta</h2>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="form-label">Nome de usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
                placeholder="Seu nome de usuário"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
                placeholder="seu@email.com"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
                placeholder="••••••••"
                minLength="6"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
            
            <div className="mb-6">
              <label className="form-label">Eu quero ser:</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <label className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'MENTEE' ? 'border-secondary bg-secondary/10' : 'border-[#ECECEC]'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="MENTEE"
                    checked={formData.role === 'MENTEE'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-xl mb-1">👨‍🎓</div>
                    <div className="font-medium">Mentee</div>
                  </div>
                </label>
                
                <label className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.role === 'MENTOR' ? 'border-primary bg-primary/10' : 'border-[#ECECEC]'}`}>
                  <input
                    type="radio"
                    name="role"
                    value="MENTOR"
                    checked={formData.role === 'MENTOR'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-xl mb-1">👨‍🏫</div>
                    <div className="font-medium">Mentor</div>
                  </div>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent w-full py-3 text-lg"
            >
              {loading ? 'Registrando...' : 'Criar conta'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Entrar
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

export default RegisterPage;
