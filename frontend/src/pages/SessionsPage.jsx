import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sessionService from '../services/sessionService';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

function SessionsPage() {
  const { apiClient, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'mentor', 'mentee'
  const isMentor = user?.role === 'MENTOR';

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Busca sessões do usuário autenticado
        const data = apiClient
          ? await sessionService.getSessions(apiClient)
          : await sessionService.getSessions();
        // Busca dados do outro usuário para cada sessão
        const sessionsWithUsers = await Promise.all(
          (data || []).map(async (session) => {
            let otherUserId = null;
            if (user) {
              otherUserId = user.id === session.mentorId ? session.menteeId : session.mentorId;
            }
            let otherUser = null;
            if (otherUserId) {
              otherUser = apiClient
                ? await userService.getUserById(apiClient, otherUserId)
                : await userService.getUserById(otherUserId);
            }
            // Ajusta para garantir date/time para os filtros
            let date = session.date;
            let time = session.time;
            if (!date || !time) {
              // Se não vier separado, tenta extrair de start
              if (session.start) {
                const d = new Date(session.start);
                date = d.toISOString().slice(0, 10);
                time = d.toTimeString().slice(0, 5);
              }
            }
            // Adiciona informação sobre o papel do usuário nesta sessão
            const userRole = user?.id === session.mentorId ? 'mentor' : 'mentee';
            return { ...session, otherUser, date, time, userRole };
          })
        );
        setSessions(sessionsWithUsers);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError('Não foi possível carregar suas sessões. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [apiClient, user]);

  // Filtrar sessões com base na aba ativa e no modo de visualização
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date + 'T' + session.time);
    const now = new Date();
    
    // Filtro por data (próximas/passadas)
    const dateFilter = activeTab === 'upcoming' 
      ? sessionDate > now 
      : sessionDate < now;
    
    // Filtro por papel (mentor/mentee/todos)
    const roleFilter = viewMode === 'all' 
      ? true 
      : session.userRole === viewMode;
    
    return dateFilter && roleFilter;
  });

  // Ordenar sessões por data
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
  });

  // Formatar data para exibição
  const formatDate = (dateStr, timeStr) => {
    const date = new Date(dateStr + 'T' + timeStr);
    const day = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const time = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { day, time };
  };

  // Obter estatísticas de sessões
  const getSessionStats = () => {
    const upcoming = sessions.filter(s => new Date(s.date + 'T' + s.time) > new Date()).length;
    const past = sessions.filter(s => new Date(s.date + 'T' + s.time) <= new Date()).length;
    const asMentor = sessions.filter(s => s.userRole === 'mentor').length;
    const asMentee = sessions.filter(s => s.userRole === 'mentee').length;
    
    return { upcoming, past, total: sessions.length, asMentor, asMentee };
  };

  const stats = getSessionStats();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold font-display mb-2">Minhas Sessões</h2>
          <p className="text-text-secondary">
            Gerencie e acompanhe todas as suas sessões de mentoria
          </p>
        </div>
        {isMentor && (
          <Link to="/availability" className="btn btn-primary mt-4 md:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Gerenciar Disponibilidade
          </Link>
        )}
      </div>

      {/* Estatísticas de sessões */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card bg-primary/5 p-4">
          <div className="text-3xl font-bold text-primary mb-1">{stats.total}</div>
          <div className="text-text-secondary text-sm">Total de sessões</div>
        </div>
        <div className="card bg-green-50 p-4">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.upcoming}</div>
          <div className="text-text-secondary text-sm">Sessões agendadas</div>
        </div>
        <div className="card bg-blue-50 p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats.past}</div>
          <div className="text-text-secondary text-sm">Sessões concluídas</div>
        </div>
        <div className="card bg-purple-50 p-4">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {isMentor ? stats.asMentor : stats.asMentee}
          </div>
          <div className="text-text-secondary text-sm">
            {isMentor ? 'Como mentor' : 'Como mentee'}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row justify-between mb-6">
        {/* Tabs para próximas/passadas */}
        <div className="flex border-b border-[#ECECEC] mb-4 md:mb-0">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-6 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Próximas Sessões
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 px-6 font-medium transition-colors ${
              activeTab === 'past'
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            Sessões Passadas
          </button>
        </div>

        {/* Filtro por papel (apenas se o usuário tiver ambos os papéis) */}
        {stats.asMentor > 0 && stats.asMentee > 0 && (
          <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-text-secondary hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setViewMode('mentor')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'mentor'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-text-secondary hover:bg-gray-200'
              }`}
            >
              Como Mentor
            </button>
            <button
              onClick={() => setViewMode('mentee')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'mentee'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-text-secondary hover:bg-gray-200'
              }`}
            >
              Como Mentee
            </button>
          </div>
        )}
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-4 text-text-secondary">Carregando sessões...</p>
        </div>
      ) : sortedSessions.length > 0 ? (
        <div className="space-y-4">
          {sortedSessions.map(session => {
            const { day, time } = formatDate(session.date, session.time);
            const isMentorInSession = session.userRole === 'mentor';
            
            return (
              <div key={session.id} className={`card hover:shadow-lg transition-shadow ${
                isMentorInSession ? 'border-l-4 border-purple-400' : 'border-l-4 border-blue-400'
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center text-sm text-offwhite font-bold ${
                        isMentorInSession ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {session.otherUser?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold">{session.otherUser?.username || 'Usuário'}</h3>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            isMentorInSession ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isMentorInSession ? 'Você é mentor' : 'Você é mentee'}
                          </span>
                        </div>
                        <p className="text-text-muted text-sm">{session.otherUser?.title || (isMentorInSession ? 'Seu mentee' : 'Seu mentor')}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{day} às {time}</span>
                    </div>
                    {session.topic && (
                      <div className="mt-2 text-text-secondary">
                        <span className="font-medium">Tópico:</span> {session.topic}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      activeTab === 'upcoming'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {activeTab === 'upcoming' ? 'Agendada' : 'Concluída'}
                    </span>
                    <Link 
                      to={`/sessions/${session.id}`} 
                      className={`btn ${isMentorInSession ? 'btn-secondary' : 'btn-primary'}`}
                    >
                      {activeTab === 'upcoming' ? 'Ver Detalhes' : 'Ver Resumo'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">
            {activeTab === 'upcoming' ? 'Nenhuma sessão agendada' : 'Nenhuma sessão passada'}
            {viewMode !== 'all' && ` como ${viewMode === 'mentor' ? 'mentor' : 'mentee'}`}
          </h3>
          <p className="text-text-secondary mb-6">
            {activeTab === 'upcoming' 
              ? (viewMode === 'mentee' || viewMode === 'all' 
                ? 'Você não tem sessões agendadas no momento. Que tal encontrar um mentor?' 
                : 'Você não tem sessões de mentoria agendadas. Atualize sua disponibilidade para receber solicitações.')
              : `Você ainda não participou de nenhuma sessão de mentoria${viewMode !== 'all' ? ` como ${viewMode === 'mentor' ? 'mentor' : 'mentee'}` : ''}.`}
          </p>
          {activeTab === 'upcoming' && (
            viewMode === 'mentee' || viewMode === 'all' ? (
              <Link to="/mentors" className="btn btn-primary">
                Encontrar Mentores
              </Link>
            ) : isMentor && (
              <Link to="/availability" className="btn btn-secondary">
                Gerenciar Disponibilidade
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
