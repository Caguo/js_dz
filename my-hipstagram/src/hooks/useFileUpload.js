import { useState } from 'react';

// Обновите BASE_URL на соответствующий URL вашего сервера
const BASE_URL = 'http://hipstagram.node.ed.asmer.org.ua';

const useFileUpload = (uploadUrl, token) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFiles = async (files) => {
    setIsUploading(true);
    setError(null);

    const promises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Upload result:', data); // Для отладки

        // Убедитесь, что URL формируется правильно
        const fullUrl = data.url.startsWith('http') ? data.url : `${BASE_URL}${data.url.startsWith('/') ? data.url : `/${data.url}`}`;
        return { id: data._id, url: fullUrl };
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки файла:', err);
        return null;
      }
    });

    try {
      const results = await Promise.all(promises);
      return results.filter(result => result !== null);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка при загрузке файлов:', err);
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFiles, isUploading, error };
};

export default useFileUpload;
