import { useState } from 'react';
import { useUploadImageMutation } from '../redux/userAboutApi'; // Путь к вашему API

const useUploadImg = () => {
  const [uploadImage] = useUploadImageMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async (file) => {
    setUploading(true);

    try {
      // Создаем FormData для отправки изображения
      const formData = new FormData();
      formData.append('file', file);

      // Выполняем запрос на сервер
      const response = await fetch('http://hipstagram.node.ed.asmer.org.ua/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Замените на способ получения токена из вашего состояния
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ImageUpsert($file: Upload!) {
              ImageUpsert(file: $file) {
                url
              }
            }
          `,
          variables: {
            file: formData
          }
        }),
      });

      const result = await response.json();
      if (result.data) {
        const imageUrl = result.data.ImageUpsert.url;
        setImagePreview(imageUrl);
        setUploading(false);
        return imageUrl;
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
    } finally {
      setUploading(false);
    }
    return null;
  };

  return { imagePreview, handleUploadImage, uploading };
};

export default useUploadImg;