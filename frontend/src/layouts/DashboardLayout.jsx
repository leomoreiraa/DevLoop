import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Sidebar links com ícones e cores de destaque
  const sidebarLinks = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      accentColor: 'border-primary' 
    },
    { 
      path: '/profile', 
      label: 'Meu Perfil', 
      icon: '👤',
      accentColor: 'border-accent' 
    },
    { 
      path: '/sessions', 
      label: 'Minhas Sessões', 
      icon: '📅',
      accentColor: 'border-secondary' 
    },
  ];

  // Adicionar links específicos baseados no papel do usuário
  if (user?.role === 'MENTEE') {
    sidebarLinks.push({ 
      path: '/mentors', 
      label: 'Buscar Mentores', 
      icon: '🔍',
      accentColor: 'border-primary' 
    });
  }

  if (user?.role === 'MENTOR') {
    sidebarLinks.push({ 
      path: '/availability', 
      label: 'Disponibilidade', 
      icon: '⏰',
      accentColor: 'border-accent' 
    });
  }

  return (
    <div className="flex h-screen bg-background font-sans">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex md:w-64 flex-col shadow-card bg-offwhite">
        <div className="p-4 border-b border-[#ECECEC] flex items-center">
          <img src="/logo.svg" alt="DevLoop Logo" className="h-8" />
        </div>
        
        <nav className="flex-1 mt-6 px-3 space-y-1.5">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition duration-150 ease-in-out relative
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-text-primary hover:bg-background'}`
              }
            >
              {/* Barra de destaque lateral */}
              <span 
                className={`absolute left-0 top-0 h-full w-1 rounded-r-lg ${link.accentColor} ${
                  ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0'
                }`} 
                aria-hidden="true"
              />
              <span className="text-xl mr-3" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Informações do usuário e logout */}
        <div className="p-4 border-t border-[#ECECEC] mt-auto">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-primary rounded-full mr-3 flex items-center justify-center text-sm text-offwhite font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-text-primary">{user?.username || 'Usuário'}</p>
              <p className="text-text-muted text-xs">{user?.role === 'MENTOR' ? 'Mentor' : 'Mentee'}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-text-primary rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out"
            aria-label="Sair da conta"
          >
            <span className="text-xl mr-3">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header para mobile */}
        <header className="md:hidden bg-offwhite shadow-soft p-4 flex items-center justify-between">
          <img src="/logo.svg" alt="DevLoop Logo" className="h-8" />
          
          {/* Menu mobile (simplificado) */}
          <div className="flex items-center space-x-4">
            <NavLink to="/dashboard" aria-label="Dashboard" className="text-2xl">📊</NavLink>
            <NavLink to="/sessions" aria-label="Sessões" className="text-2xl">📅</NavLink>
            <NavLink to="/profile" aria-label="Perfil" className="text-2xl">👤</NavLink>
            <button onClick={handleLogout} aria-label="Sair" className="text-2xl">🚪</button>
          </div>
        </header>
        
        {/* Área de conteúdo principal */}
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
