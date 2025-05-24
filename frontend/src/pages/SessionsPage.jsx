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
            return { ...session, otherUser, date, time };
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

  // Filtrar sessões com base na aba ativa
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date + 'T' + session.time);
    const now = new Date();
    if (activeTab === 'upcoming') {
      return sessionDate > now;
    } else if (activeTab === 'past') {
      return sessionDate < now;
    }
    return true;
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

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold font-display">Minhas Sessões</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#ECECEC] mb-6">
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
            return (
              <div key={session.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 bg-primary rounded-full mr-3 flex items-center justify-center text-sm text-offwhite font-bold">
                        {session.otherUser?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3 className="font-bold">{session.otherUser?.username || 'Usuário'}</h3>
                        <p className="text-text-muted text-sm">{session.otherUser?.title || (session.mentorId ? 'Mentor' : 'Mentee')}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-text-secondary">
                      <span className="mr-2">📅</span>
                      <span>{day} às {time}</span>
                    </div>
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
                      className="btn btn-primary"
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
          </h3>
          <p className="text-text-secondary mb-6">
            {activeTab === 'upcoming' 
              ? 'Você não tem sessões agendadas no momento. Que tal encontrar um mentor?' 
              : 'Você ainda não participou de nenhuma sessão de mentoria.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/mentors" className="btn btn-primary">
              Encontrar Mentores
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
