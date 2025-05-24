import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';

function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    skills: []
  });
  const [availableSkills, setAvailableSkills] = useState([
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'UI/UX', 
    'DevOps', 'Data Science', 'Mobile', 'Cloud', 'Arquitetura'
  ]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await userService.getMentors();
        setMentors(data);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
        setError('Não foi possível carregar a lista de mentores. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const toggleSkillFilter = (skill) => {
    setFilters(prev => {
      const isSelected = prev.skills.includes(skill);
      return {
        ...prev,
        skills: isSelected
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill]
      };
    });
  };

  const filteredMentors = mentors.filter(mentor => {
    // Filtro por texto de busca
    const searchMatch = filters.search === '' || 
      mentor.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      (mentor.title && mentor.title.toLowerCase().includes(filters.search.toLowerCase()));
    
    // Filtro por habilidades
    const skillsMatch = filters.skills.length === 0 || 
      filters.skills.some(skill => mentor.skills && mentor.skills.includes(skill));
    
    return searchMatch && skillsMatch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold font-display">Encontre seu Mentor</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label htmlFor="search" className="form-label">Buscar por nome ou título</label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={handleSearchChange}
              className="input-field"
              placeholder="Ex: React, Frontend, João..."
            />
          </div>
          
          <div className="flex-1">
            <label className="form-label mb-3">Filtrar por habilidades</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters.skills.includes(skill)
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-secondary hover:bg-primary/10'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Mentores */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
          <p className="mt-4 text-text-secondary">Carregando mentores...</p>
        </div>
      ) : filteredMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map(mentor => (
            <div key={mentor.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <div className="h-16 w-16 bg-primary rounded-full mr-4 flex items-center justify-center text-xl text-offwhite font-bold">
                  {mentor.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{mentor.username}</h3>
                  <p className="text-text-secondary text-sm">{mentor.title || 'Mentor'}</p>
                </div>
              </div>
              
              {mentor.skills && mentor.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {mentor.skills.length > 3 && (
                      <span className="px-2 py-1 bg-background text-text-muted text-xs rounded-full">
                        +{mentor.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                {mentor.bio || 'Este mentor ainda não adicionou uma biografia.'}
              </p>
              
              <div className="flex justify-between items-center">
                <Link 
                  to={`/mentors/${mentor.id}`} 
                  className="text-primary font-medium hover:underline"
                >
                  Ver perfil
                </Link>
                <Link 
                  to={`/mentors/${mentor.id}`} 
                  className="btn btn-primary"
                >
                  Agendar
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">Nenhum mentor encontrado</h3>
          <p className="text-text-secondary mb-6">
            Não encontramos mentores com os filtros selecionados. Tente ajustar sua busca.
          </p>
          <button
            onClick={() => setFilters({ search: '', skills: [] })}
            className="btn btn-primary"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default MentorsPage;
