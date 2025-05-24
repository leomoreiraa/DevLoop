import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

function ProfilePage() {
  const { user, apiClient } = useAuth(); // <-- Adicione apiClient se necessário
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    skills: '',
    title: '',
    experience: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Passe apiClient se o serviço exigir
        const profileData = apiClient
          ? await userService.getProfile(apiClient)
          : await userService.getProfile();
        setProfile(profileData);
        setFormData({
          username: profileData.username || '',
          email: profileData.email || '',
          bio: profileData.bio || '',
          skills: profileData.skills?.join(', ') || '',
          title: profileData.title || '',
          experience: profileData.experience || ''
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError('Não foi possível carregar o perfil. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, apiClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      // Convert skills string to array
      const updatedProfile = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };

      // Passe apiClient e userId se o serviço exigir
      if (apiClient && user?.id) {
        await userService.updateUser(apiClient, user.id, updatedProfile);
      } else if (user?.id) {
        await userService.updateUser(user.id, updatedProfile);
      } else {
        throw new Error("Usuário não encontrado.");
      }

      setProfile({
        ...profile,
        ...updatedProfile,
        skills: updatedProfile.skills
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError('Não foi possível atualizar o perfil. Tente novamente mais tarde.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full font-sans text-text-primary animate-pulse">
        Carregando perfil...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-bold font-display">Meu Perfil</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4 md:mt-0"
          >
            Editar Perfil
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="card border-l-4 border-primary">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="username" className="form-label">Nome de usuário</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  disabled={saveLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  disabled={true}
                />
              </div>
              <div>
                <label htmlFor="title" className="form-label">Título Profissional</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ex: Desenvolvedor Frontend Senior"
                  disabled={saveLoading}
                />
              </div>
              <div>
                <label htmlFor="skills" className="form-label">Habilidades (separadas por vírgula)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ex: React, JavaScript, CSS"
                  disabled={saveLoading}
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="bio" className="form-label">Biografia</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Conte um pouco sobre você..."
                disabled={saveLoading}
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="experience" className="form-label">Experiência</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows="4"
                className="input-field"
                placeholder="Descreva sua experiência profissional..."
                disabled={saveLoading}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn bg-[#ECECEC] text-text-primary hover:bg-[#E0E0E0]"
                disabled={saveLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saveLoading}
              >
                {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Informações básicas */}
          <div className="md:col-span-1">
            <div className="card mb-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 bg-primary rounded-full mb-4 flex items-center justify-center text-3xl text-offwhite font-bold">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-xl font-bold mb-1">{profile?.username || 'Usuário'}</h3>
                <p className="text-text-secondary mb-2">{profile?.title || 'Sem título'}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary mb-4">
                  {user?.role === 'MENTOR' ? 'Mentor' : 'Mentee'}
                </span>
                <p className="text-text-muted text-sm">{profile?.email || 'email@exemplo.com'}</p>
              </div>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
              {profile?.skills && profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted">Nenhuma habilidade adicionada</p>
              )}
            </div>
          </div>
          {/* Coluna da direita - Bio e experiência */}
          <div className="md:col-span-2">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Sobre mim</h3>
              {profile?.bio ? (
                <p className="text-text-secondary whitespace-pre-line">{profile.bio}</p>
              ) : (
                <p className="text-text-muted">Nenhuma biografia adicionada</p>
              )}
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Experiência</h3>
              {profile?.experience ? (
                <p className="text-text-secondary whitespace-pre-line">{profile.experience}</p>
              ) : (
                <p className="text-text-muted">Nenhuma experiência adicionada</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
