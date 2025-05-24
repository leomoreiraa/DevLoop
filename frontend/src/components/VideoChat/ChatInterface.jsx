import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente de interface de chat para sessões agendadas
 */
const ChatInterface = ({ sessionId, username, userId, role }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);
  
  // Conectar ao WebSocket quando o componente montar
  useEffect(() => {
    connectWebSocket();
    
    // Limpar conexão quando o componente desmontar
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [sessionId]);
  
  // Rolar para o final quando novas mensagens chegarem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const connectWebSocket = () => {
    if (!sessionId || !userId) {
      setError('Informações de sessão ou usuário ausentes.');
      return;
    }
    
    setConnecting(true);
    setError('');
    
    try {
      // Em uma implementação real, conectar ao WebSocket do backend
      // Para fins de demonstração, simulamos a conexão
      
      // Simular conexão WebSocket
      setTimeout(() => {
        // Simular mensagens iniciais
        const initialMessages = [
          {
            id: 1,
            senderId: userId === 1 ? 2 : 1,
            senderName: userId === 1 ? 'João Silva' : 'Maria Oliveira',
            content: 'Olá! Tudo bem?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
          },
          {
            id: 2,
            senderId: userId,
            senderName: username,
            content: 'Oi! Tudo ótimo, e com você?',
            timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString()
          },
          {
            id: 3,
            senderId: userId === 1 ? 2 : 1,
            senderName: userId === 1 ? 'João Silva' : 'Maria Oliveira',
            content: 'Estou bem! Pronto para nossa sessão de hoje?',
            timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString()
          }
        ];
        
        setMessages(initialMessages);
        setConnected(true);
        setConnecting(false);
      }, 1500);
      
    } catch (err) {
      console.error('Erro ao conectar ao chat:', err);
      setError('Falha ao conectar ao chat. Por favor, tente novamente.');
      setConnecting(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !connected) return;
    
    // Em uma implementação real, enviar mensagem via WebSocket
    // Para fins de demonstração, apenas adicionamos localmente
    
    const message = {
      id: Date.now(),
      senderId: userId,
      senderName: username,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  // Agrupar mensagens por data
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="card p-0 flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#ECECEC]">
        <h3 className="text-lg font-semibold">Chat da Sessão</h3>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 m-4 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4">
        {connecting ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
              <p className="mt-2 text-text-secondary text-sm">Conectando ao chat...</p>
            </div>
          </div>
        ) : connected && Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-text-secondary">
              <div className="text-4xl mb-2">💬</div>
              <p>Nenhuma mensagem ainda</p>
              <p className="text-sm mt-1">Seja o primeiro a enviar uma mensagem!</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="mb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="h-px bg-[#ECECEC] flex-1"></div>
                <span className="px-3 text-xs text-text-muted">{date}</span>
                <div className="h-px bg-[#ECECEC] flex-1"></div>
              </div>
              
              {dateMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`mb-3 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === userId 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-background text-text-primary rounded-tl-none'
                    }`}
                  >
                    {message.senderId !== userId && (
                      <div className="text-xs font-medium mb-1">
                        {message.senderName}
                      </div>
                    )}
                    <div className="break-words">{message.content}</div>
                    <div className={`text-xs mt-1 text-right ${
                      message.senderId === userId ? 'text-white/70' : 'text-text-muted'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Formulário de envio */}
      <div className="p-4 border-t border-[#ECECEC]">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 input-field"
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !newMessage.trim()}
            className={`btn ${
              !connected || !newMessage.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
