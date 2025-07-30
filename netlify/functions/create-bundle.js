// Расположение файла: /netlify/functions/create-bundle.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', // Можно заменить на ваш домен
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // Функция безопасно берет ключ из настроек Netlify
  const { JSONBIN_MASTER_KEY } = process.env;
  if (!JSONBIN_MASTER_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: Missing API key.' }) };
  }

  try {
    const data = JSON.parse(event.body);
    const binName = `invitation-bundle-${new Date().toISOString()}`;

    // Отправляем запрос в JSONBin с секретным ключом
    const response = await fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_MASTER_KEY,
        'X-Bin-Name': binName,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { statusCode: response.status, headers, body: JSON.stringify({ error: `Failed to save data: ${errorBody}` }) };
    }

    const result = await response.json();
    const binId = result.metadata.id;
    
    // Формируем финальную ссылку, которую вернем пользователю
    const siteUrl = new URL(event.headers.referer || 'https://example.com');
    const mainTemplate = data.main.template || 'wedding-classic.html';
    const mainLink = `${siteUrl.origin}/templates/${mainTemplate}?id=${binId}&page=main`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Data saved successfully!',
        id: binId,
        link: mainLink, // Возвращаем готовую ссылку
      }),
    };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: `An internal error occurred: ${error.message}` }) };
  }
};