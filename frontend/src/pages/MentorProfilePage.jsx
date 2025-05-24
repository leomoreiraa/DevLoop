import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import userService from '../services/userService';
import sessionService from '../services/sessionService';

function MentorProfilePage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getMentorById(id);
        setMentor(data);
        
        // Simular datas disponíveis (em produção, viria da API)
        const dates = generateDummyDates();
        setAvailableDates(dates);
      } catch (err) {
        console.error("Failed to fetch mentor profile:", err);
        setError('Não foi possível carregar o perfil do mentor. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorProfile();
    }
  }, [id]);

  // Função para gerar datas fictícias para demonstração
  const generateDummyDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Excluir finais de semana
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(formatDate(date));
      }
    }
    
    return dates;
  };

  // Função para formatar data
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Quando uma data é selecionada, gerar horários disponíveis
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    
    // Simular horários disponíveis (em produção, viria da API)
    const times = generateDummyTimes();
    setAvailableTimes(times);
  };

  // Função para gerar horários fictícios para demonstração
  const generateDummyTimes = () => {
    const times = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Adicionar apenas alguns horários para simular disponibilidade limitada
      if (Math.random() > 0.5) {
        times.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      
      if (hour < endHour && Math.random() > 0.7) {
        times.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    
    return times.sort();
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) {
      setBookingStatus({
        loading: false,
        success: false,
        error: 'Por favor, selecione uma data e horário.'
      });
      return;
    }
    
    setBookingStatus({ loading: true, success: false, error: '' });
    
    try {
      // Em produção, isso chamaria a API real
      await sessionService.bookSession(id, selectedDate, selectedTime);
      setBookingStatus({
        loading: false,
        success: true,
        error: ''
      });
    } catch (err) {
      console.error("Failed to book session:", err);
      setBookingStatus({
        loading: false,
        success: false,
        error: 'Não foi possível agendar a sessão. Tente novamente mais tarde.'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full font-sans text-text-primary animate-pulse py-16">
        Carregando perfil do mentor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <Link to="/mentors" className="btn btn-primary mt-4">
            Voltar para lista de mentores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/mentors" className="text-primary hover:underline flex items-center">
          <span className="mr-2">←</span> Voltar para lista de mentores
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna da esquerda - Perfil do mentor */}
        <div className="md:col-span-2">
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
              <div className="h-20 w-20 bg-primary rounded-full mr-6 flex items-center justify-center text-2xl text-offwhite font-bold mb-4 sm:mb-0">
                {mentor?.username?.charAt(0).toUpperCase() || 'M'}
              </div>
              <div>
                <h2 className="text-2xl font-bold font-display">{mentor?.username || 'Mentor'}</h2>
                <p className="text-text-secondary">{mentor?.title || 'Mentor Profissional'}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mentor?.skills?.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Sobre</h3>
              <p className="text-text-secondary whitespace-pre-line">
                {mentor?.bio || 'Este mentor ainda não adicionou uma biografia.'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Experiência</h3>
              <p className="text-text-secondary whitespace-pre-line">
                {mentor?.experience || 'Este mentor ainda não adicionou sua experiência.'}
              </p>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Avaliações</h3>
            <div className="bg-background rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">⭐</div>
              <p className="text-text-secondary mb-4">Este mentor ainda não possui avaliações.</p>
              <p className="text-text-muted text-sm">
                As avaliações aparecerão aqui após a conclusão de sessões de mentoria.
              </p>
            </div>
          </div>
        </div>
        
        {/* Coluna da direita - Agendamento */}
        <div className="md:col-span-1">
          <div className="card border-l-4 border-primary sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Agendar Sessão</h3>
            
            {bookingStatus.success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-center">
                <div className="text-3xl mb-2">✅</div>
                <h4 className="font-bold mb-2">Sessão Agendada!</h4>
                <p className="mb-4">
                  Sua sessão com {mentor?.username} foi agendada para {selectedDate} às {selectedTime}.
                </p>
                <Link to="/sessions" className="btn btn-primary w-full">
                  Ver Minhas Sessões
                </Link>
              </div>
            ) : (
              <>
                {bookingStatus.error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                    {bookingStatus.error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="date" className="form-label">Selecione uma data</label>
                  <select
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="input-field"
                    disabled={bookingStatus.loading}
                  >
                    <option value="">Escolha uma data</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedDate && (
                  <div className="mb-6">
                    <label htmlFor="time" className="form-label">Selecione um horário</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimes.length > 0 ? (
                        availableTimes.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                              selectedTime === time
                                ? 'bg-primary text-white'
                                : 'bg-background text-text-secondary hover:bg-primary/10'
                            }`}
                            disabled={bookingStatus.loading}
                          >
                            {time}
                          </button>
                        ))
                      ) : (
                        <p className="col-span-3 text-text-muted text-sm py-2">
                          Nenhum horário disponível nesta data.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleBookSession}
                  disabled={!selectedDate || !selectedTime || bookingStatus.loading}
                  className="btn btn-primary w-full py-3"
                >
                  {bookingStatus.loading ? 'Agendando...' : 'Agendar Sessão'}
                </button>
                
                <p className="text-text-muted text-sm mt-4 text-center">
                  Ao agendar, você concorda com os termos de uso da plataforma.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorProfilePage;
