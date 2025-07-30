// Файл: build.js (Финальная, исправленная версия)

const fs = require('fs');

// ИСПРАВЛЕНО: Добавлен rsvp-form.html в список
const filesToProcess = [
    './index.html', 
    './templates/wedding-classic.html', 
    './templates/rsvp-form.html'
];

console.log('Starting key replacement...');

const googleKey = process.env.GOOGLE_MAPS_API_KEY;
const jsonbinAccessKey = process.env.JSONBIN_ACCESS_KEY; // Ключ только для ЧТЕНИЯ

// ПРОВЕРКА ИСПРАВЛЕНА: Нам больше не нужен мастер-ключ здесь
if (!googleKey || !jsonbinAccessKey) {
    console.error('Error: GOOGLE_MAPS_API_KEY or JSONBIN_ACCESS_KEY not found in environment variables.');
    return process.exit(1);
}

filesToProcess.forEach(filePath => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return process.exit(1);
        }

        console.log(`Processing ${filePath}...`);
        
        let result = data.replace(/__GOOGLE_MAPS_API_KEY__/g, googleKey);
        result = result.replace(/__JSONBIN_ACCESS_KEY__/g, jsonbinAccessKey);
        
        // УДАЛЕНО: Больше не вставляем небезопасный мастер-ключ
        // result = result.replace(/__JSONBIN_MASTER_KEY__/g, jsonbinMasterKey);

        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${filePath}`, err);
                return process.exit(1);
            }
            console.log(`Public API keys have been successfully injected into ${filePath}.`);
        });
    });
});