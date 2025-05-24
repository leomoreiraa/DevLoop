import React, { useState } from 'react';

/**
 * Componente para upload de vídeos relacionados a sessões
 */
const VideoUploader = ({ sessionId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Formato de arquivo inválido. Por favor, selecione um vídeo MP4, WebM ou OGG.');
      setFile(null);
      return;
    }

    // Validar tamanho (limite de 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB em bytes
    if (selectedFile.size > maxSize) {
      setError('O arquivo é muito grande. O tamanho máximo é 100MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file || !sessionId) return;

    setUploading(true);
    setProgress(0);
    setError('');
    setSuccess(false);

    // Criar FormData para envio do arquivo
    const formData = new FormData();
    formData.append('video', file);
    formData.append('sessionId', sessionId);

    try {
      // Simular upload com progresso
      // Em produção, substituir por chamada real à API
      const uploadPromise = new Promise((resolve, reject) => {
        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 10;
          setProgress(progressValue);
          
          if (progressValue >= 100) {
            clearInterval(interval);
            resolve({
              success: true,
              videoUrl: URL.createObjectURL(file),
              message: 'Upload concluído com sucesso!'
            });
          }
        }, 500);
      });

      const result = await uploadPromise;
      setSuccess(true);
      
      if (onUploadComplete) {
        onUploadComplete({
          videoUrl: result.videoUrl,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Erro ao fazer upload do vídeo:', err);
      setError('Falha ao fazer upload do vídeo. Por favor, tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Upload de Vídeo</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
          Vídeo enviado com sucesso!
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Selecione um vídeo para upload
        </label>
        <input
          type="file"
          accept="video/mp4,video/webm,video/ogg"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-secondary
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
          disabled={uploading}
        />
        <p className="mt-1 text-xs text-text-muted">
          Formatos aceitos: MP4, WebM, OGG. Tamanho máximo: 100MB.
        </p>
      </div>
      
      {file && !uploading && !success && (
        <div className="mb-4">
          <p className="text-sm text-text-secondary">
            <span className="font-medium">Arquivo selecionado:</span> {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
          </p>
        </div>
      )}
      
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-text-secondary text-center">
            Enviando... {progress}%
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || uploading || success}
          className={`btn ${
            !file || uploading || success
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {uploading ? 'Enviando...' : 'Enviar Vídeo'}
        </button>
      </div>
    </div>
  );
};

export default VideoUploader;
