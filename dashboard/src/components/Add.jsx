import React, { useState } from 'react';
import { Button } from './Button';
import { FaUpload } from 'react-icons/fa6';
import Modal from './Modal';
import { useAuth } from '../context/authContext';
import api from '../api';

const Add = ({ onUnauthorized }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { hasPermission } = useAuth();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      api
        .post('/task/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Custom-Header': 'value',
          },
        })
        .then((res) => {
          console.log('File uploaded successfully!:', res.data);
          alert('File successfully uploaded');
          handleCloseModel();
        })
        .catch((e) => {
          console.error(e.message);
          alert('Error uploading file:');
        });
    } catch (error) {
      console.error('Error uploading file:', error.response || error.message);
      alert('Error uploading file!');
    }
  };

  return (
    <div className="">
      <Button onClick={handleOpenModal} className="flex items-center">
        <FaUpload className="mr-2" />
        Загрузить Файл
      </Button>
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModel}>
        <h2 className="text-lg font-bold mb-4">Загружать Файл</h2>
        <input
          type="file"
          onChange={handleFileChange}
          placeholder="Загрузить Файл"
          disabled={!hasPermission(['admin', 'user'])}
        />
        <Button className="" onClick={handleUpload}>
          Загружать
        </Button>
      </Modal>
    </div>
  );
};

export default Add;
