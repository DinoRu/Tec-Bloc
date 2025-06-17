import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FaLock, FaEye, FaEyeSlash, FaCheck } from 'react-icons/fa';
// ... imports identiques

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Пароль успешно изменён!');

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(error.message || 'Не удалось изменить пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Сменить пароль
          </h1>
          <p className="text-gray-500">Введите свои данные для безопасности</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-3 rounded-lg text-red-700">{error}</div>
          )}

          {success && (
            <div className="bg-green-50 p-3 rounded-lg text-green-700 flex items-center">
              <FaCheck className="mr-2" />
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Текущий пароль"
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Новый пароль"
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Подтвердите новый пароль"
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-200"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium">Требования к паролю:</p>
            <ul className="list-disc pl-5 mt-1">
              <li className={newPassword.length >= 8 ? 'text-green-500' : ''}>
                Не менее 8 символов
              </li>
              <li className={/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}>
                По крайней мере одна заглавная буква
              </li>
              <li className={/\d/.test(newPassword) ? 'text-green-500' : ''}>
                По крайней мере одна цифра
              </li>
              <li
                className={
                  /[!@#$%^&*]/.test(newPassword) ? 'text-green-500' : ''
                }
              >
                Спецсимвол (!@#$%^&*)
              </li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg'
            } text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center`}
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Сменить пароль'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-purple-600 hover:text-purple-700 text-sm underline"
            onClick={() => navigate(-1)}
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
