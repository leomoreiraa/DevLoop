import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';

function ImageUploader({ onImageUpload, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    // Verificar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Formato de arquivo inválido. Use PNG, JPG ou GIF.');
      return;
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Enviar para o componente pai
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      // Converter para base64
      const base64 = await convertToBase64(file);
      onImageUpload(base64);
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast.error('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6">
      <label className="form-label">Foto de Perfil</label>
      
      {/* Área de upload */}
      <div 
        className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Preview da imagem */}
        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" 
              />
              <button 
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                title="Remover imagem"
              >
                ×
              </button>
            </div>
            <span className="text-sm text-text-secondary">
              Clique no botão abaixo para alterar a imagem
            </span>
          </div>
        ) : (
          <div className="py-4">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-text-secondary mb-2">
              Arraste e solte uma imagem aqui ou clique para selecionar
            </p>
            <p className="text-xs text-text-muted">
              Formatos aceitos: PNG, JPG, GIF (máx. 5MB)
            </p>
          </div>
        )}
        
        {/* Input de arquivo (oculto) */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
        />
        
        {/* Botão de upload */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="mt-4 btn btn-secondary"
        >
          {isUploading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent mr-2"></span>
              Enviando...
            </>
          ) : preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
        </button>
      </div>
    </div>
  );
}

export default ImageUploader;
