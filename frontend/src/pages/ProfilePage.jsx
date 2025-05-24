import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

function ProfilePage() {
  const { user, apiClient } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError('');
    setSuccess('');

    try {
      // Apenas enviar campos editáveis para evitar sobrescrever dados sensíveis
      const profileData = {
        username: formData.username,
        bio: formData.bio,
        title: formData.title,
        experience: formData.experience,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };

      // Usa o novo endpoint seguro para atualização de perfil
      if (apiClient && user?.id) {
        await userService.updateUserProfile(apiClient, user.id, profileData);
      } else if (user?.id) {
        await userService.updateUserProfile(user.id, profileData);
      } else {
        throw new Error("Usuário não encontrado.");
      }

      // Atualizar o estado local com os campos editados
      setProfile({
        ...profile,
        ...profileData
      });
      setIsEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError('Não foi possível atualizar o perfil. Tente novamente mais tarde.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Validar senhas
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres.');
      setPasswordLoading(false);
      return;
    }

    try {
      // Usar o novo endpoint seguro para alteração de senha
      if (apiClient && user?.id) {
        await userService.updateUserPassword(apiClient, user.id, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        });
      } else {
        throw new Error("Não foi possível alterar a senha.");
      }

      // Limpar formulário
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordSuccess('Senha alterada com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
      
    } catch (err) {
      console.error("Failed to update password:", err);
      setPasswordError('Não foi possível alterar a senha. Verifique se a senha atual está correta.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full font-sans text-text-primary">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-display mb-2">Meu Perfil</h2>
          <p className="text-text-secondary">Gerencie suas informações pessoais e configurações de conta</p>
        </div>
        {!isEditing && activeTab === 'profile' && (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn btn-primary mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar Perfil
          </button>
        )}
      </div>

      {/* Mensagens de erro/sucesso */}
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

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-100">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Abas de navegação */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            Informações do Perfil
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
            }`}
          >
            Segurança
          </button>
        </nav>
      </div>

      {/* Conteúdo da aba de perfil */}
      {activeTab === 'profile' && (
        <>
          {isEditing ? (
            <div className="card border-l-4 border-primary">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-3xl text-offwhite font-bold">
                      {formData.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <p className="text-center text-text-secondary text-sm mb-6">
                    A foto de perfil é gerada automaticamente a partir da primeira letra do seu nome de usuário.
                  </p>
                </div>

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
                      required
                    />
                    <p className="text-text-muted text-xs mt-1">Este nome será visível para outros usuários.</p>
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      className="input-field bg-gray-50"
                      disabled={true}
                    />
                    <p className="text-text-muted text-xs mt-1">Para alterar seu email, entre em contato com o suporte.</p>
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
                    <p className="text-text-muted text-xs mt-1">Seu cargo ou especialidade atual.</p>
                  </div>
                  <div>
                    <label htmlFor="skills" className="form-label">Habilidades</label>
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
                    <p className="text-text-muted text-xs mt-1">Separe as habilidades por vírgula.</p>
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
                  <p className="text-text-muted text-xs mt-1">Uma breve descrição sobre você e seus interesses.</p>
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
                  <p className="text-text-muted text-xs mt-1">Descreva sua experiência profissional, projetos e conquistas.</p>
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
                    {saveLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : 'Salvar Alterações'}
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
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-text-muted">Nenhuma habilidade adicionada</p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-primary text-sm hover:underline mt-2"
                      >
                        Adicionar habilidades
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Coluna da direita - Bio e experiência */}
              <div className="md:col-span-2">
                <div className="card mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Sobre mim</h3>
                    {!profile?.bio && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-primary text-sm hover:underline"
                      >
                        Adicionar biografia
                      </button>
                    )}
                  </div>
                  {profile?.bio ? (
                    <p className="text-text-secondary whitespace-pre-line">{profile.bio}</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-text-muted">Nenhuma biografia adicionada</p>
                      <p className="text-text-muted text-sm mt-2">Adicione uma biografia para que outros usuários possam conhecer você melhor.</p>
                    </div>
                  )}
                </div>
                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Experiência</h3>
                    {!profile?.experience && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-primary text-sm hover:underline"
                      >
                        Adicionar experiência
                      </button>
                    )}
                  </div>
                  {profile?.experience ? (
                    <p className="text-text-secondary whitespace-pre-line">{profile.experience}</p>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-text-muted">Nenhuma experiência adicionada</p>
                      <p className="text-text-muted text-sm mt-2">Compartilhe sua experiência profissional para destacar suas qualificações.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Conteúdo da aba de segurança */}
      {activeTab === 'security' && (
        <div className="card border-l-4 border-secondary">
          <h3 className="text-xl font-bold mb-6">Alterar Senha</h3>
          
          {passwordError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm border border-red-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {passwordError}
              </div>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm border border-green-100">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {passwordSuccess}
              </div>
            </div>
          )}
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-6">
              <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input-field"
                required
                disabled={passwordLoading}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="newPassword" className="form-label">Nova Senha</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
                required
                disabled={passwordLoading}
                minLength={6}
              />
              <p className="text-text-muted text-xs mt-1">A senha deve ter pelo menos 6 caracteres.</p>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input-field"
                required
                disabled={passwordLoading}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-secondary"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Alterando senha...
                  </span>
                ) : 'Alterar Senha'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-semibold mb-4">Dicas de Segurança</h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Use uma senha forte com pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos.
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Não use a mesma senha em vários sites ou serviços.
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Altere sua senha regularmente, pelo menos a cada 3 meses.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
