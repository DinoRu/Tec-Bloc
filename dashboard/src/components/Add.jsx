import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { FaUpload, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';
import Modal from './Modal';
import { useAuth } from '../context/authContext';
import api from '../api';

const Add = ({ onUnauthorized }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { hasPermission } = useAuth();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!hasPermission(['admin', 'user'])) {
      onUnauthorized?.();
      return;
    }

    if (!selectedFile) {
      alert('Пожалуйста, выберите файл!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      api
        .post('/task/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Custom-Header': 'value',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          },
        })
        .then((res) => {
          console.log('File uploaded successfully!:', res.data);
          setTimeout(() => {
            alert('Файл успешно загружен');
            handleCloseModal();
          }, 300);
        })
        .catch((e) => {
          console.error(e.message);
          alert('Ошибка загрузки файла:');
        })
        .finally(() => {
          setIsUploading(false);
        });
    } catch (error) {
      console.error('Error uploading file:', error.response || error.message);
      alert('Ошибка загрузки файла!');
      setIsUploading(false);
    }
  };

  const canUpload = hasPermission(['admin', 'user']);

  return (
    <div>
      <Button
        onClick={handleOpenModal}
        className={`flex items-center transition-all duration-300 ${
          canUpload
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!canUpload}
      >
        <FaUpload className="mr-2" />
        Загрузить Файл
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Загрузка файла</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {isUploading ? (
            <div className="py-8">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-600">
                Загрузка: {uploadProgress}%
              </p>
            </div>
          ) : (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} 
                  ${!canUpload && 'opacity-50 cursor-not-allowed'}`}
                role="button"
                tabIndex={0}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => canUpload && fileInputRef.current.click()}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && canUpload) {
                    e.preventDefault();
                    fileInputRef.current.click();
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!canUpload}
                />

                <FaCloudUploadAlt className="mx-auto text-4xl text-indigo-500 mb-3" />
                <p className="text-gray-700 mb-1">
                  {selectedFile ? (
                    <span className="font-medium">{selectedFile.name}</span>
                  ) : (
                    'Перетащите файл сюда или нажмите'
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedFile
                    ? `Размер: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                    : 'Поддерживаемые форматы: любые'}
                </p>
              </div>

              {!canUpload && (
                <p className="text-red-500 text-center mt-4">
                  У вас нет прав для загрузки файлов
                </p>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={handleCloseModal}>
                  Отмена
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !canUpload}
                  className={`transition-all ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaUpload className="mr-2" />
                  Загрузить
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Add;
