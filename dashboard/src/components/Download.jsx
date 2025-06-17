import React from 'react';
import { Button } from './Button';
import { FaDownload } from 'react-icons/fa6';
import api from '../api';

const Download = () => {
  const handleDownload = async () => {
    try {
      const response = await api.post(
        '/task/download',
        {},
        {
          responseType: 'blob',
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Reports.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error('Error download file: ', e);
    }
  };

  return (
    <Button
      className="bg-green-500 hover:bg-green-600 flex items-center"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Скачать
    </Button>
  );
};

export default Download;
