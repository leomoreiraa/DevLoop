import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import sessionService from '../services/sessionService';

function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        setLoading(true);
        const data = await sessionService.getSessionById(id);
        setSession(data);
      } catch (err) {
        console.error("Failed to fetch session details:", err);
        setError('Não foi possível carregar os detalhes da sessão. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSessionDetails();
    }
  }, [id]);

  const handleCancelSession = async () => {
    if (!cancelConfirm) {
      setCancelConfirm(true);
      return;
    }
    
    setCancelLoading(true);
    
    try {
      await sessionService.cancelSession(id);
      // Atualizar o status da sessão localmente
      setSession(prev => ({
        ...prev,
        status: 'CANCELLED'
      }));
      setCancelConfirm(false);
    } catch (err) {
      console.error("Failed to cancel session:", err);
      setError('Não foi possível cancelar a sessão. Tente novamente mais tarde.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Formatar data para exibição
  const formatDate = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return { day: 'Data não disponível', time: 'Horário não disponível' };
    
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

  // Verificar se a sessão é futura ou passada
  const isUpcoming = () => {
    if (!session?.date || !session?.time) return false;
    
    const sessionDate = new Date(session.date + 'T' + session.time);
    const now = new Date();
    
    return sessionDate > now;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full font-sans text-text-primary animate-pulse py-16">
        Carregando detalhes da sessão...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <Link to="/sessions" className="btn btn-primary mt-4">
            Voltar para minhas sessões
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-yellow-50 text-yellow-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Sessão não encontrada</h2>
          <p>Não foi possível encontrar os detalhes desta sessão.</p>
          <Link to="/sessions" className="btn btn-primary mt-4">
            Voltar para minhas sessões
          </Link>
        </div>
      </div>
    );
  }

  const { day, time } = formatDate(session.date, session.time);
  const upcoming = isUpcoming();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/sessions" className="text-primary hover:underline flex items-center">
          <span className="mr-2">←</span> Voltar para minhas sessões
        </Link>
      </div>

      <div className="card border-l-4 border-primary mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold font-display mb-2 md:mb-0">
            {upcoming ? 'Detalhes da Sessão' : 'Resumo da Sessão'}
          </h2>
          
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            session.status === 'CANCELLED'
              ? 'bg-red-100 text-red-700'
              : upcoming
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {session.status === 'CANCELLED'
              ? 'Cancelada'
              : upcoming
                ? 'Agendada'
                : 'Concluída'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações da Sessão</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-text-muted text-sm">Data</p>
                <p className="text-text-primary font-medium">{day}</p>
              </div>
              
              <div>
                <p className="text-text-muted text-sm">Horário</p>
                <p className="text-text-primary font-medium">{time}</p>
              </div>
              
              <div>
                <p className="text-text-muted text-sm">Duração</p>
                <p className="text-text-primary font-medium">60 minutos</p>
              </div>
              
              {session.meetingLink && (
                <div>
                  <p className="text-text-muted text-sm">Link da Reunião</p>
                  <a 
                    href={session.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    Acessar reunião
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {session.mentorId ? 'Mentor' : 'Mentee'}
            </h3>
            
            <div className="flex items-start mb-4">
              <div className="h-12 w-12 bg-primary rounded-full mr-4 flex items-center justify-center text-sm text-offwhite font-bold">
                {session.otherUser?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h4 className="font-bold">{session.otherUser?.username || 'Usuário'}</h4>
                <p className="text-text-muted text-sm">{session.otherUser?.title || (session.mentorId ? 'Mentor' : 'Mentee')}</p>
                
                {session.otherUser?.skills && session.otherUser.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {session.otherUser.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Link 
              to={`/mentors/${session.mentorId}`} 
              className="text-primary hover:underline font-medium"
            >
              Ver perfil completo
            </Link>
          </div>
        </div>

        {session.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Notas da Sessão</h3>
            <p className="text-text-secondary whitespace-pre-line bg-background p-4 rounded-lg">
              {session.notes}
            </p>
          </div>
        )}

        {upcoming && session.status !== 'CANCELLED' && (
          <div className="border-t border-[#ECECEC] pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Ações</h3>
            
            {cancelConfirm ? (
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-red-700 font-medium mb-4">
                  Tem certeza que deseja cancelar esta sessão? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCancelConfirm(false)}
                    className="btn bg-[#ECECEC] text-text-primary hover:bg-[#E0E0E0]"
                    disabled={cancelLoading}
                  >
                    Não, manter sessão
                  </button>
                  <button
                    onClick={handleCancelSession}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? 'Cancelando...' : 'Sim, cancelar sessão'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSession}
                  className="btn bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Cancelar Sessão
                </button>
                
                {session.meetingLink && (
                  <a 
                    href={session.meetingLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Entrar na Reunião
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {!upcoming && session.status !== 'CANCELLED' && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Avaliação</h3>
          
          <div className="bg-background rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">⭐</div>
            <p className="text-text-secondary mb-4">
              Avalie sua experiência com {session.otherUser?.username || 'seu mentor'}.
            </p>
            <button className="btn btn-primary">
              Avaliar Sessão
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionDetailPage;
