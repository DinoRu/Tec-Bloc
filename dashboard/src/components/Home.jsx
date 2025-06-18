import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/ru';
import {
  FaUserShield,
  FaSignOutAlt,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { Button } from './Button';
import Add from './Add';
import Delete from './Delete';
import Download from './Download';
import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';
import api from '../api';

dayjs.extend(customParseFormat);
dayjs.locale('ru');

function Home() {
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/task/completed');
        setCompletedTasks(response.data);
        setFilteredTasks(response.data);
      } catch (error) {
        console.error('Ошибка при получении задач', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchCompletedTasks();
    }
  }, [user]);

  // Filtrer les tâches en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTasks(completedTasks);
    } else {
      const filtered = completedTasks.filter(
        (task) =>
          task.dispatcher_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.worker?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.comments?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredTasks(filtered);
    }
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  }, [searchTerm, completedTasks]);

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">ТБ</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Тех-Блок
              </h1>
              <p className="text-gray-600">
                {user
                  ? `Привет, ${user.username}!`
                  : 'Система управления задачами'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {hasPermission(['admin']) && (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-3 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <FaUserShield className="mr-2" />
                <span>Управление пользователями</span>
              </Button>
            )}

            <button
              onClick={logout}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <FaSignOutAlt />
              <span>Выход</span>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 w-full rounded-full mb-8"></div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-3">
              {hasPermission(['admin', 'user']) && (
                <Add
                  onUnauthorized={() =>
                    alert('У вас нет разрешения на загрузку')
                  }
                />
              )}
              <Download />
              {hasPermission(['admin']) && <Delete />}
            </div>

            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск задач..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tableau des tâches accomplies */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    Объект и работ
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Тип работ
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Адрес</th>
                  <th className="px-6 py-4 text-left font-semibold">План</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Напряжение
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Дата</th>
                  <th className="px-6 py-4 text-left font-semibold">Фото</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Исполнитель
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin h-8 w-8 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      </div>
                    </td>
                  </tr>
                ) : currentTasks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Нет выполненных задач
                    </td>
                  </tr>
                ) : (
                  currentTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {task.dispatcher_name}
                        </div>
                        <div className="text-sm text-gray-500">{task.job}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {task.work_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.address}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.planner_date}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {task.voltage} КВ
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {dayjs(task.completion_date, 'DD-MM-YYYY HH:mm').format(
                          'DD MMM YYYY',
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {task.photos.map((photo, index) => (
                            <a
                              key={index}
                              href={photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded"
                            >
                              Фото {index + 1}
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
                          <span className="font-medium">
                            {task.worker?.username}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTasks.length > tasksPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Показано{' '}
                <span className="font-medium">
                  {Math.min(indexOfFirstTask + 1, filteredTasks.length)}
                </span>{' '}
                -
                <span className="font-medium">
                  {' '}
                  {Math.min(indexOfLastTask, filteredTasks.length)}
                </span>{' '}
                из
                <span className="font-medium">
                  {' '}
                  {filteredTasks.length}
                </span>{' '}
                задач
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaChevronLeft className="mr-1" /> Назад
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Calcul pour afficher seulement 5 pages à la fois
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Вперед <FaChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
