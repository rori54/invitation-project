// Импорт 'node-fetch' больше не нужен, fetch доступен глобально.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const dataToSave = JSON.parse(event.body);
    
    // Берем ключи и URL сайта из переменных окружения Netlify.
    const { JSONBIN_MASTER_KEY, URL } = process.env;

    if (!JSONBIN_MASTER_KEY) {
      // Эта ошибка будет видна в логах функции на Netlify
      throw new Error('Server Error: JSONBIN_MASTER_KEY is not configured.');
    }

    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_MASTER_KEY,
        'X-Bin-Name': 'invitation-bundle'
      },
      body: JSON.stringify(dataToSave)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('JSONBin API Error:', errorData);
      throw new Error(errorData.message || 'Failed to create bin on JSONBin');
    }

    const result = await response.json();
    const binId = result.metadata.id;
    
    // Формируем ссылку ДИНАМИЧЕСКИ, используя URL сайта из переменных Netlify
    const mainTemplateFile = dataToSave.main.template || 'wedding-classic.html';
    const shareLink = `${URL}/templates/${mainTemplateFile}?id=${binId}&page=main`;

    return {
      statusCode: 200,
      body: JSON.stringify({ link: shareLink }),
    };

  } catch (err) {
    console.error('Function Error:', err);
    return {
      statusCode: 500,
      // Возвращаем чистое сообщение об ошибке, а не всю страницу
      body: JSON.stringify({ error: err.message }),
    };
  }
};