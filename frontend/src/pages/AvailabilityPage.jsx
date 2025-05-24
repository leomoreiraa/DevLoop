import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import availabilityService from '../services/availabilityService';

function AvailabilityPage() {
  const { user, apiClient } = useAuth();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Dias da semana para seleção
  const weekdays = [
    { value: 'MONDAY', label: 'Segunda-feira' },
    { value: 'TUESDAY', label: 'Terça-feira' },
    { value: 'WEDNESDAY', label: 'Quarta-feira' },
    { value: 'THURSDAY', label: 'Quinta-feira' },
    { value: 'FRIDAY', label: 'Sexta-feira' },
    { value: 'SATURDAY', label: 'Sábado' },
    { value: 'SUNDAY', label: 'Domingo' }
  ];

  // Horários disponíveis para seleção (9h às 18h, intervalos de 30min)
  const availableTimeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 18) {
      availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!apiClient || !user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await availabilityService.getAvailability(apiClient, user.id);
        setAvailabilities(data || []);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
        setError('Não foi possível carregar sua disponibilidade. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [user, apiClient]);

  // Quando um dia da semana é selecionado, carregar os horários disponíveis
  useEffect(() => {
    if (selectedDay) {
      const dayAvailability = availabilities.find(a => a.dayOfWeek === selectedDay);
      setTimeSlots(dayAvailability?.timeSlots || []);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDay, availabilities]);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const toggleTimeSlot = (timeSlot) => {
    setTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [...prev, timeSlot].sort();
      }
    });
  };

  const handleSaveAvailability = async () => {
    if (!selectedDay) {
      setError('Por favor, selecione um dia da semana.');
      return;
    }
    if (!apiClient || !user?.id) {
      setError('Usuário ou conexão não disponível.');
      return;
    }

    setSaveLoading(true);
    setSaveSuccess(false);
    setError('');

    try {
      // Corrigido: envie um objeto como availabilityData
      await availabilityService.updateAvailability(
        apiClient,
        user.id,
        { dayOfWeek: selectedDay, timeSlots }
      );

      // Atualizar o estado local
      setAvailabilities(prev => {
        const existingIndex = prev.findIndex(a => a.dayOfWeek === selectedDay);

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { dayOfWeek: selectedDay, timeSlots };
          return updated;
        } else {
          return [...prev, { dayOfWeek: selectedDay, timeSlots }];
        }
      });

      setSaveSuccess(true);
    } catch (err) {
      console.error("Failed to update availability:", err);
      setError('Não foi possível atualizar sua disponibilidade. Tente novamente mais tarde.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold font-display">Gerenciar Disponibilidade</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-100">
          Disponibilidade atualizada com sucesso!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna da esquerda - Seleção de dia e horários */}
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Configurar Disponibilidade</h3>

            <div className="mb-6">
              <label htmlFor="dayOfWeek" className="form-label">Dia da Semana</label>
              <select
                id="dayOfWeek"
                value={selectedDay}
                onChange={handleDayChange}
                className="input-field"
              >
                <option value="">Selecione um dia</option>
                {weekdays.map(day => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedDay && (
              <>
                <div className="mb-6">
                  <label className="form-label mb-3">Horários Disponíveis</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableTimeSlots.map(timeSlot => (
                      <button
                        key={timeSlot}
                        type="button"
                        onClick={() => toggleTimeSlot(timeSlot)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          timeSlots.includes(timeSlot)
                            ? 'bg-primary text-white'
                            : 'bg-background text-text-secondary hover:bg-primary/10'
                        }`}
                      >
                        {timeSlot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveAvailability}
                    disabled={saveLoading}
                    className="btn btn-primary"
                  >
                    {saveLoading ? 'Salvando...' : 'Salvar Disponibilidade'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Coluna da direita - Resumo da disponibilidade */}
        <div className="md:col-span-1">
          <div className="card sticky top-8">
            <h3 className="text-lg font-semibold mb-4">Resumo da Disponibilidade</h3>

            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
                <p className="mt-2 text-text-secondary text-sm">Carregando...</p>
              </div>
            ) : availabilities.length > 0 ? (
              <div className="space-y-4">
                {weekdays.map(day => {
                  const dayAvailability = availabilities.find(a => a.dayOfWeek === day.value);

                  return (
                    <div key={day.value} className="border-b border-[#ECECEC] pb-3 last:border-b-0">
                      <h4 className="font-medium mb-1">{day.label}</h4>
                      {dayAvailability && dayAvailability.timeSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {dayAvailability.timeSlots.map(time => (
                            <span key={time} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {time}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-text-muted text-sm">Nenhum horário disponível</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-background rounded-lg p-4 text-center">
                <p className="text-text-secondary mb-2">Nenhuma disponibilidade configurada.</p>
                <p className="text-text-muted text-sm">
                  Selecione um dia da semana e configure seus horários disponíveis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityPage;
