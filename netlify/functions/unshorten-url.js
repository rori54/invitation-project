const fetch = require('node-fetch');

// Эта функция теперь ищет название места в ссылке
function extractPlaceNameFromUrl(url) {
    const match = url.match(/\/maps\/place\/([^\/]+)/);
    if (match && match[1]) {
        // Декодируем название (например, "St.+Paul's+Cathedral" -> "St. Paul's Cathedral")
        return decodeURIComponent(match[1].replace(/\+/g, ' '));
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
        
        const placeName = extractPlaceNameFromUrl(longUrl);

        if (placeName) {
            // Возвращаем не ID, а НАЗВАНИЕ
            return {
                statusCode: 200,
                body: JSON.stringify({ placeName: placeName }),
            };
        } else {
            return { statusCode: 404, body: JSON.stringify({ error: 'Place name not found in URL.' }) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch the URL.' }) };
    }
};