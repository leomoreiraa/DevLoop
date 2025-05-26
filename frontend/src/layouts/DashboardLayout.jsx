import React from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
);

function DashboardLayout({ children }) { // <-- Recebe children
  const { user, logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <LoadingSpinner />
        <p className="text-text-secondary">Carregando sua sessão...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('DashboardLayout: Not authenticated or user is null, redirecting to login.');
    return <Navigate to="/login" replace />;
  }

  const sidebarLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', accentColor: 'border-primary' },
    { path: '/profile', label: 'Meu Perfil', icon: '👤', accentColor: 'border-accent' },
    { path: '/sessions', label: 'Minhas Sessões', icon: '📅', accentColor: 'border-secondary' },
  ];

  if (user?.role === 'MENTEE') {
    sidebarLinks.push({ path: '/mentors', label: 'Buscar Mentores', icon: '🔍', accentColor: 'border-primary' });
  }
  if (user?.role === 'MENTOR') {
    sidebarLinks.push({ path: '/availability', label: 'Disponibilidade', icon: '⏰', accentColor: 'border-accent' });
  }

  return (
    <div className="flex h-screen bg-background font-sans">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex md:w-64 flex-col shadow-card bg-offwhite">
        <div className="p-4 border-b border-[#ECECEC] flex items-center">
          <img src="/logo.svg" alt="DevLoop Logo" className="h-8" />
        </div>
        <nav className="flex-1 mt-6 px-3 space-y-1.5">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg transition duration-150 ease-in-out relative group
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-text-primary hover:bg-background'}`
              }
            >
              <span className="text-xl ml-2 mr-3" aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-[#ECECEC] mt-auto">
          <div className="flex items-center mb-4">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="h-10 w-10 rounded-full mr-3 object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 bg-primary rounded-full mr-3 flex items-center justify-center text-sm text-offwhite font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-medium text-text-primary truncate">{user?.username || 'Usuário'}</p>
              <p className="text-text-muted text-xs">{user?.role === 'MENTOR' ? 'Mentor' : 'Mentee'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-text-primary rounded-lg hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out group"
            aria-label="Sair da conta"
          >
            <span className="text-xl mr-3 group-hover:text-red-600">🚪</span>
            <span className="group-hover:text-red-600">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header for mobile */}
        <header className="md:hidden bg-offwhite shadow-soft p-4 flex items-center justify-between sticky top-0 z-10">
          <img src="/logo.svg" alt="DevLoop Logo" className="h-8" />
          <div className="flex items-center space-x-4">
            <NavLink to="/dashboard" aria-label="Dashboard" className={({ isActive }) => `text-2xl ${isActive ? 'text-primary' : 'text-text-secondary'}`}>📊</NavLink>
            <NavLink to="/sessions" aria-label="Sessões" className={({ isActive }) => `text-2xl ${isActive ? 'text-primary' : 'text-text-secondary'}`}>📅</NavLink>
            <NavLink to="/profile" aria-label="Perfil" className={({ isActive }) => `text-2xl ${isActive ? 'text-primary' : 'text-text-secondary'}`}>👤</NavLink>
            <button onClick={handleLogout} aria-label="Sair" className="text-2xl text-text-secondary">🚪</button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

