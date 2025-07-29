const fetch = require('node-fetch');

// Мы переносим регулярные выражения из браузера прямо сюда, на сервер!
function extractPlaceIdFromMapsUrl(url) {
    const patterns = [
        /place_id:([a-zA-Z0-9_-]+)/,
        /data=.*?1s([a-zA-Z0-9_-]+)/,
        /\/maps\/place\/[^\/]+\/data=.*?1s([a-zA-Z0-9_-]+)!/,
        /ftid=([a-zA-Z0-9_-]+)/,
        /place\/(.*?)\//
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
}

exports.handler = async function(event) {
    const shortUrl = event.queryStringParameters.url;
    if (!shortUrl) {
        return { statusCode: 400, body: JSON.stringify({ error: 'URL parameter is required.' }) };
    }

    try {
        const response = await fetch(shortUrl, { method: 'HEAD', redirect: 'manual' });
        const longUrl = response.headers.get('location') || shortUrl;
        
        // Главное изменение: мы ищем Place ID прямо здесь!
        const placeId = extractPlaceIdFromMapsUrl(longUrl);

        if (placeId) {
            // И возвращаем не ссылку, а готовый Place ID!
            return {
                statusCode: 200,
                body: JSON.stringify({ placeId: placeId }),
            };
        } else {
            return { statusCode: 404, body: JSON.stringify({ error: 'Place ID not found in URL.' }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch the URL.' }) };
    }
};