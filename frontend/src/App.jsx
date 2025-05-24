import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SessionsPage from './pages/SessionsPage';
import SessionDetailPage from './pages/SessionDetailPage';
import MentorsPage from './pages/MentorsPage';
import MentorProfilePage from './pages/MentorProfilePage';
import AvailabilityPage from './pages/AvailabilityPage';
import DashboardLayout from './layouts/DashboardLayout';

// NotFoundPage pode ser um componente simples:
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p className="mb-6">Página não encontrada.</p>
        <a href="/" className="btn btn-primary">Voltar para o início</a>
      </div>
    </div>
  );
}

// Wrapper para rotas protegidas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Wrapper para rotas por papel
function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return user && allowedRoles.includes(user.role)
    ? children
    : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SessionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sessions/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SessionDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rotas para mentee */}
      <Route
        path="/mentors"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['MENTEE']}>
              <DashboardLayout>
                <MentorsPage />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentors/:id"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['MENTEE']}>
              <DashboardLayout>
                <MentorProfilePage />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Rotas para mentor */}
      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['MENTOR']}>
              <DashboardLayout>
                <AvailabilityPage />
              </DashboardLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Rota 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

