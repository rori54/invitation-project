const fs = require('fs');
const filePath = './index.html';

console.log('Starting key replacement...');

// Читаем содержимое файла index.html
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return process.exit(1);
    }

    // Проверяем, что переменные окружения доступны
    const googleKey = process.env.GOOGLE_MAPS_API_KEY;
    const jsonbinKey = process.env.JSONBIN_API_KEY;

    if (!googleKey || !jsonbinKey) {
        console.error('Error: API keys not found in environment variables.');
        return process.exit(1);
    }

    // Выполняем замену
    let result = data.replace(/__GOOGLE_MAPS_API_KEY__/g, googleKey);
    result = result.replace(/__JSONBIN_API_KEY__/g, jsonbinKey);

    // Записываем измененное содержимое обратно в файл
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return process.exit(1);
        }
        console.log('API keys have been successfully injected.');
    });
});