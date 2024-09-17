import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggleFollowMutation } from '../redux/userApiSlice'; // Путь к вашему API
import { updateSubscriptions } from '../redux/subscriptionSlice'; // Путь к вашему срезу состояния

/**
 * Хук для управления подписками и отписками.
 * @param {Function} onSuccess - Функция для вызова при успешной подписке/отписке.
 * @param {Function} onError - Функция для вызова при ошибке.
 */
const useToggleFollow = (onSuccess, onError) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user?.UserFindOne);
  const currentUserId = currentUser?._id;
  const [toggleFollow] = useToggleFollowMutation();

  const handleToggleFollow = useCallback(
    async (targetUser, action) => {
      const targetUserId = targetUser?._id;

      if (!currentUserId) {
        console.error('currentUserId is missing:', currentUserId);
        return;
      }

      if (!targetUserId) {
        console.error('targetUserId is missing:', targetUserId);
        return;
      }

      const currentFollowing = currentUser?.following?.map(user => ({ _id: user._id })) || [];
      
      let updatedFollowing;
      if (action === 'follow') {
        if (!currentFollowing.some(user => user._id === targetUserId)) {
          updatedFollowing = [...currentFollowing, { _id: targetUserId }];
        } else {
          console.warn('User is already following this target.');
          return;
        }
      } else if (action === 'unfollow') {
        updatedFollowing = currentFollowing.filter(user => user._id !== targetUserId);
      } else {
        console.error('Invalid action:', action);
        return;
      }

      try {
        // Передаем полный список подписок в мутацию
        const result = await toggleFollow({
          currentUserId,
          following: updatedFollowing
        }).unwrap();

        if (result) {
          // Обновление состояния подписок
          const updatedSubscriptions = result.following.map(following => following._id);
          dispatch(updateSubscriptions(updatedSubscriptions));
          onSuccess('Подписка обновлена успешно!');
          return { updatedFollowing }; // Возвращаем обновленный список подписок
        }
      } catch (error) {
        console.error('Ошибка при изменении подписки:', error);
        onError('Не удалось обновить подписку');
      }
    },
    [toggleFollow, currentUserId, dispatch, onSuccess, onError, currentUser] // Добавляем currentUser в зависимости
  );

  return handleToggleFollow;
};

export default useToggleFollow;
