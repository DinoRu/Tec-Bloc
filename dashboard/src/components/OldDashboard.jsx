import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import axios from 'axios';
import api from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users');
        setUsers(response.data);
      } catch (error) {
        if (error.response?.status === 401) navigate('/login');
        setError(error.response?.data?.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Filtrage et pagination
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (userId) => {
    if (window.confirm('Подтвердить удаление пользователя?')) {
      try {
        await axios.delete(config().deleteuser(userId), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUsers(users.filter((user) => user.uid !== userId));
      } catch (error) {
        alert(`Ошибка: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const translateRole = (role) => {
    const rolesMap = {
      admin: 'Администратор',
      user: 'Пользователь',
      guest: 'Гость',
      worker: 'Рабочий',
    };
    return rolesMap[role] || role;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg text-red-700 max-w-md text-center">
          <p className="font-medium">Ошибка загрузки</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Управление пользователями
          </h1>
          <p className="text-gray-600">Все пользователи системы</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header avec bouton et recherche */}
          <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto"
            >
              <FaUserPlus />
              <span>Создать пользователя</span>
            </button>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Поиск пользователей..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Логин
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Полное имя
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Роль
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Обновлён
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchTerm
                        ? 'Пользователи не найдены'
                        : 'Нет пользователей'}
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr
                      key={user.uid}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {user.full_name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : user.role === 'user'
                                ? 'bg-blue-100 text-blue-800'
                                : user.role === 'worker'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {translateRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(user.updated_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/edit-user/${user.uid}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Редактировать"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.uid)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Удалить"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано {indexOfFirstUser + 1}-
                {Math.min(indexOfLastUser, filteredUsers.length)} из{' '}
                {filteredUsers.length} пользователей
              </div>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-8 h-8 rounded flex items-center justify-center ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
