import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import sessionService from '../services/sessionService';
import userService from '../services/userService';

function DashboardPage() {
  const { user, apiClient } = useAuth();

  const [stats, setStats] = useState({
    sessions: 0,
    hours: 0,
    connections: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !apiClient) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Busca todas as sessões do usuário
        const sessions = await sessionService.getSessions(apiClient);
        // Filtra sessões futuras
        const now = new Date();
        const upcoming = sessions.filter(
          s =>
            new Date(s.start) > now &&
            (user.role === 'MENTOR'
              ? s.mentorId === user.id
              : s.menteeId === user.id)
        );
        // Conta conexões únicas
        const connections = new Set(
          sessions.map(s =>
            user.role === 'MENTOR' ? s.menteeId : s.mentorId
          )
        ).size;
        // Soma horas de mentoria
        const totalHours = sessions.reduce((acc, s) => {
          const start = new Date(s.start);
          const end = new Date(s.end);
          const diff = (end - start) / (1000 * 60 * 60);
          return acc + (diff > 0 ? diff : 0);
        }, 0);

        setStats({
          sessions: sessions.length,
          hours: totalHours,
          connections,
        });
        setUpcomingSessions(upcoming.slice(0, 3));
        
        // Buscar mentores recomendados se o usuário for mentee
        if (user.role === 'MENTEE') {
          try {
            const allUsers = await userService.getUsers(apiClient);
            const mentors = allUsers.filter(u => u.role === 'MENTOR');
            // Pegar 2 mentores aleatórios como recomendação
            const shuffled = [...mentors].sort(() => 0.5 - Math.random());
            setRecommendedMentors(shuffled.slice(0, 2));
          } catch (err) {
            console.error("Falha ao buscar mentores recomendados:", err);
            setRecommendedMentors([]);
          }
        }
      } catch (err) {
        setStats({ sessions: 0, hours: 0, connections: 0 });
        setUpcomingSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, apiClient]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full font-sans text-text-primary animate-pulse">
        Carregando informações do usuário...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 font-display">
            Olá, <span className="text-primary">{user.username}</span>!
          </h2>
          <p className="text-text-secondary">Bem-vindo(a) ao seu dashboard personalizado</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
            {user.role === 'MENTOR' ? 'Mentor' : 'Mentee'}
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-primary/10 border-none">
          <h3 className="text-lg font-semibold mb-1">Sessões Agendadas</h3>
          <p className="text-3xl font-bold">{loading ? '...' : stats.sessions}</p>
        </div>
        <div className="card bg-secondary/10 border-none">
          <h3 className="text-lg font-semibold mb-1">Horas de Mentoria</h3>
          <p className="text-3xl font-bold">{loading ? '...' : stats.hours.toFixed(1)}</p>
        </div>
        <div className="card bg-accent/10 border-none">
          <h3 className="text-lg font-semibold mb-1">Conexões</h3>
          <p className="text-3xl font-bold">{loading ? '...' : stats.connections}</p>
        </div>
      </div>

      {/* Mentee Dashboard */}
      {user.role === 'MENTEE' && (
        <div className="card border-l-4 border-primary mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-display">Área do Mentee</h3>
            <Link to="/mentors" className="btn btn-primary">
              Buscar Mentores
            </Link>
          </div>
          {/* Upcoming Sessions */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Próximas Sessões</h4>
            {loading ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <span className="animate-pulse text-text-secondary">Carregando...</span>
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-text-secondary mb-4">Você não tem sessões agendadas.</p>
                <Link to="/mentors" className="text-primary font-medium hover:underline">
                  Encontre um mentor e agende sua primeira sessão
                </Link>
              </div>
            ) : (
              <ul>
                {upcomingSessions.map(session => (
                  <li key={session.id} className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span>
                        <b>{new Date(session.start).toLocaleDateString()}</b> -{' '}
                        {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às{' '}
                        {new Date(session.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Link to={`/sessions/${session.id}`} className="btn btn-secondary mt-2 md:mt-0">
                        Ver Detalhes
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Recommended Mentors */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Mentores Recomendados</h4>
            {loading ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <span className="animate-pulse text-text-secondary">Carregando mentores recomendados...</span>
              </div>
            ) : recommendedMentors.length === 0 ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-text-secondary mb-4">Nenhum mentor disponível no momento.</p>
                <Link to="/mentors" className="text-primary font-medium hover:underline">
                  Explorar todos os mentores
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedMentors.map(mentor => (
                  <div key={mentor.id} className="card bg-offwhite border border-[#ECECEC]">
                    <div className="flex items-center mb-3">
                      {mentor.profileImage ? (
                        <img 
                          src={mentor.profileImage} 
                          alt={mentor.username} 
                          className="h-12 w-12 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-primary rounded-full mr-3 flex items-center justify-center text-sm text-offwhite font-bold">
                          {mentor.username ? mentor.username.charAt(0).toUpperCase() : 'M'}
                        </div>
                      )}
                      <div>
                        <h5 className="font-semibold">{mentor.username || 'Mentor'}</h5>
                        <p className="text-text-muted text-sm">{mentor.title || 'Mentor Profissional'}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.skills && mentor.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link to={`/mentors/${mentor.id}`} className="text-primary text-sm font-medium hover:underline">
                      Ver perfil
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mentor Dashboard */}
      {user.role === 'MENTOR' && (
        <div className="card border-l-4 border-accent mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold font-display">Área do Mentor</h3>
            <Link to="/availability" className="btn btn-accent">
              Gerenciar Disponibilidade
            </Link>
          </div>
          {/* Upcoming Sessions */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Próximas Sessões</h4>
            {loading ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <span className="animate-pulse text-text-secondary">Carregando...</span>
              </div>
            ) : upcomingSessions.length === 0 ? (
              <div className="bg-background rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">📅</div>
                <p className="text-text-secondary mb-4">Você não tem sessões agendadas.</p>
                <Link to="/availability" className="text-primary font-medium hover:underline">
                  Configure sua disponibilidade para receber agendamentos
                </Link>
              </div>
            ) : (
              <ul>
                {upcomingSessions.map(session => (
                  <li key={session.id} className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <span>
                        <b>{new Date(session.start).toLocaleDateString()}</b> -{' '}
                        {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} às{' '}
                        {new Date(session.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <Link to={`/sessions/${session.id}`} className="btn btn-secondary mt-2 md:mt-0">
                        Ver Detalhes
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Profile Completion */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Perfil de Mentor</h4>
            <div className="bg-background rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold">Completude do Perfil</h5>
                <span className="text-primary font-medium">
                  {user.bio && user.title && user.skills && user.skills.length > 0 && user.experience ? '100%' : '30%'}
                </span>
              </div>
              <div className="w-full bg-[#ECECEC] rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ 
                    width: user.bio && user.title && user.skills && user.skills.length > 0 && user.experience ? '100%' : '30%' 
                  }}
                ></div>
              </div>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center">
                  <span className="inline-block w-5 h-5 mr-2 rounded-full bg-primary/20 text-primary text-center">✓</span>
                  Informações básicas
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-5 h-5 mr-2 rounded-full ${user.skills && user.skills.length > 0 ? 'bg-primary/20 text-primary' : 'bg-[#ECECEC] text-text-muted'} text-center`}>
                    {user.skills && user.skills.length > 0 ? '✓' : '!'}
                  </span>
                  Adicionar habilidades e especialidades
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-5 h-5 mr-2 rounded-full ${user.title ? 'bg-primary/20 text-primary' : 'bg-[#ECECEC] text-text-muted'} text-center`}>
                    {user.title ? '✓' : '!'}
                  </span>
                  Configurar disponibilidade
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-5 h-5 mr-2 rounded-full ${user.bio && user.experience ? 'bg-primary/20 text-primary' : 'bg-[#ECECEC] text-text-muted'} text-center`}>
                    {user.bio && user.experience ? '✓' : '!'}
                  </span>
                  Adicionar biografia e experiência
                </li>
              </ul>
              <div className="mt-4">
                <Link to="/profile" className="btn btn-secondary">
                  Completar Perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4 font-display">Atividade Recente</h3>
        <div className="bg-background rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-text-secondary">Nenhuma atividade recente para mostrar.</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
