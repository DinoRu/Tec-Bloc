import React from 'react';
import { Button } from './Button';
import { FaDownload } from 'react-icons/fa6';
import { useAuth } from '../context/authContext';

const Download = () => {
  const { downloadReport } = useAuth();
  return (
    <Button
      className="bg-green-500 hover:bg-green-600 flex items-center"
      onClick={downloadReport}
    >
      <FaDownload className="mr-2" />
      Скачать
    </Button>
  );
};

export default Download;
