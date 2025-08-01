exports.handler = async function(event, context) {
    // Эта функция безопасно берет ключ из переменных окружения на сервере Netlify
    const { IMGBB_API_KEY } = process.env;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        // И отдает его в виде JSON только тому, кто запросил
        body: JSON.stringify({
            imgbb: IMGBB_API_KEY 
        }),
    };
};