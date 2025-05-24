import React from 'react';
import VideoUploader from './VideoUploader';
import VideoCall from './VideoCall';
import ChatInterface from './ChatInterface';

/**
 * Componente integrado para sessões de vídeo, incluindo upload, chamada e chat
 */
const SessionVideoChat = ({ session, user }) => {
  // Determinar se o usuário atual é o mentor ou o mentee
  const isHost = user?.id === session?.mentorId;
  const otherUser = session?.otherUser || {};
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna da esquerda - Chamada de vídeo */}
      <div className="lg:col-span-2">
        <VideoCall 
          sessionId={session?.id} 
          participantName={otherUser?.username || 'Participante'} 
          isHost={isHost} 
        />
        
        <div className="mt-6">
          <VideoUploader 
            sessionId={session?.id} 
            onUploadComplete={(videoData) => {
              console.log('Vídeo enviado:', videoData);
              // Aqui você pode atualizar o estado da sessão com o vídeo enviado
            }} 
          />
        </div>
      </div>
      
      {/* Coluna da direita - Chat */}
      <div className="lg:col-span-1">
        <ChatInterface 
          sessionId={session?.id} 
          username={user?.username || 'Usuário'} 
          userId={user?.id} 
          role={isHost ? 'MENTOR' : 'MENTEE'} 
        />
      </div>
    </div>
  );
};

export default SessionVideoChat;
