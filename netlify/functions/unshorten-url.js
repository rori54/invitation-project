// Используем fetch для выполнения запросов. Он доступен в среде Netlify Functions.
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Получаем URL из параметров запроса (e.g., /.netlify/functions/unshorten-url?url=https://...)
    const shortUrl = event.queryStringParameters.url;

    if (!shortUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL parameter is required.' }),
        };
    }

    try {
        // Делаем HEAD-запрос к короткой ссылке.
        // HEAD-запрос эффективнее, так как он запрашивает только заголовки, а не всё содержимое страницы.
        // Мы не следуем за редиректом автоматически (redirect: 'manual'), чтобы "поймать" его.
        const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'manual' });

        // Полный URL находится в заголовке 'Location'.
        // Коды редиректа обычно 301, 302, 307, 308.
        if (response.status >= 300 && response.status < 400) {
            const longUrl = response.headers.get('location');
            if (longUrl) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ longUrl: longUrl }),
                };
            }
        }
        
        // Если это не редирект, возможно, ссылка уже полная. Возвращаем ее как есть.
        return {
            statusCode: 200,
            body: JSON.stringify({ longUrl: shortUrl }),
        };

    } catch (error) {
        console.error('Error unshortening URL:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch the URL.' }),
        };
    }
};