import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useToggleFollowMutation } from '../redux/userApiSlice';

/**
 * Хук для управления подписками и отписками.
 * @param {Function} onSuccess - Функция для вызова при успешной подписке/отписке.
 * @param {Function} onError - Функция для вызова при ошибке.
 */
const useToggleFollow = (onSuccess, onError) => {
  const [toggleFollow] = useToggleFollowMutation();
  const currentUserId = useSelector((state) => state.auth.user?._id);

  const handleToggleFollow = useCallback(
    async (targetUserId, action) => {
      try {
        const result = await toggleFollow({ currentUserId, targetUserId, action }).unwrap();
        if (result) {
          onSuccess('Подписка обновлена успешно!');
        }
      } catch (error) {
        console.error('Ошибка при изменении подписки:', error);
        onError('Не удалось обновить подписку');
      }
    },
    [toggleFollow, currentUserId, onSuccess, onError]
  );

  return handleToggleFollow;
};

export default useToggleFollow;
