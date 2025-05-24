import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente para chamadas de vídeo em tempo real para sessões
 */
const VideoCall = ({ sessionId, participantName, isHost = false }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenShareStreamRef = useRef(null);
  const originalStreamRef = useRef(null);
  
  // Inicializar mídia local quando o componente montar
  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        originalStreamRef.current = stream;
      } catch (err) {
        console.error('Erro ao acessar câmera e microfone:', err);
        setError('Não foi possível acessar sua câmera e microfone. Verifique as permissões do navegador.');
      }
    };
    
    initLocalStream();
    
    // Limpar streams quando o componente desmontar
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Simular conexão com outro participante
  const handleConnect = async () => {
    if (!localStream) return;
    
    setConnecting(true);
    setError('');
    
    try {
      // Em uma implementação real, aqui seria a lógica de sinalização e WebRTC
      // Para fins de demonstração, estamos apenas simulando uma conexão
      
      // Simular delay de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular stream remoto (usando o stream local como exemplo)
      setRemoteStream(localStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = localStream;
      }
      
      setConnected(true);
    } catch (err) {
      console.error('Erro ao conectar chamada:', err);
      setError('Falha ao estabelecer conexão. Por favor, tente novamente.');
    } finally {
      setConnecting(false);
    }
  };
  
  // Encerrar chamada
  const handleDisconnect = () => {
    setConnected(false);
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };
  
  // Alternar microfone
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  // Alternar câmera
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  // Compartilhar tela
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Parar compartilhamento e voltar para câmera
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Restaurar stream original
      setLocalStream(originalStreamRef.current);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = originalStreamRef.current;
      }
      
      setIsScreenSharing(false);
    } else {
      try {
        // Iniciar compartilhamento de tela
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        // Guardar referência para poder parar depois
        screenShareStreamRef.current = screenStream;
        
        // Combinar áudio original com vídeo da tela
        const audioTrack = originalStreamRef.current.getAudioTracks()[0];
        const newStream = new MediaStream([
          screenStream.getVideoTracks()[0],
          audioTrack
        ]);
        
        // Atualizar stream local
        setLocalStream(newStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }
        
        // Detectar quando o usuário parar o compartilhamento
        screenStream.getVideoTracks()[0].onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Erro ao compartilhar tela:', err);
        setError('Não foi possível compartilhar sua tela. Verifique as permissões do navegador.');
      }
    }
  };
  
  // Alternar tela cheia
  const toggleFullScreen = () => {
    if (!remoteVideoRef.current) return;
    
    if (!isFullScreen) {
      if (remoteVideoRef.current.requestFullscreen) {
        remoteVideoRef.current.requestFullscreen();
      } else if (remoteVideoRef.current.webkitRequestFullscreen) {
        remoteVideoRef.current.webkitRequestFullscreen();
      } else if (remoteVideoRef.current.msRequestFullscreen) {
        remoteVideoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };
  
  // Detectar quando sair da tela cheia
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Chamada de Vídeo</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Vídeo remoto (participante) */}
        <div className="md:col-span-2 bg-gray-900 rounded-lg overflow-hidden relative">
          {connected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-64 md:h-80">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">👥</div>
                <p>Aguardando conexão...</p>
              </div>
            </div>
          )}
          
          {connected && (
            <div className="absolute bottom-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
              {isHost ? 'Participante' : 'Mentor'}
            </div>
          )}
        </div>
        
        {/* Vídeo local (você) */}
        <div className="bg-gray-900 rounded-lg overflow-hidden relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-40 md:h-full object-cover"
          />
          
          <div className="absolute bottom-2 right-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            Você ({isHost ? 'Mentor' : 'Participante'})
          </div>
        </div>
      </div>
      
      {/* Controles */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title={isMuted ? 'Ativar microfone' : 'Desativar microfone'}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title={isVideoOff ? 'Ativar câmera' : 'Desativar câmera'}
        >
          {isVideoOff ? '🚫' : '📹'}
        </button>
        
        <button
          onClick={toggleScreenShare}
          className={`p-3 rounded-full ${
            isScreenSharing ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
          title={isScreenSharing ? 'Parar compartilhamento' : 'Compartilhar tela'}
        >
          💻
        </button>
        
        {connected && (
          <button
            onClick={toggleFullScreen}
            className="p-3 rounded-full bg-gray-200 text-gray-700"
            title={isFullScreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullScreen ? '⏹️' : '⏫'}
          </button>
        )}
        
        {connected ? (
          <button
            onClick={handleDisconnect}
            className="p-3 rounded-full bg-red-600 text-white"
            title="Encerrar chamada"
          >
            📞
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting || !localStream}
            className={`p-3 rounded-full ${
              connecting || !localStream
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white'
            }`}
            title="Iniciar chamada"
          >
            {connecting ? '⏳' : '📞'}
          </button>
        )}
      </div>
      
      {/* Status */}
      <div className="text-center text-sm text-text-secondary">
        {connecting ? (
          <p>Conectando chamada...</p>
        ) : connected ? (
          <p>Chamada em andamento</p>
        ) : (
          <p>Pronto para iniciar a chamada</p>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
