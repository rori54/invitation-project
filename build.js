const fs = require('fs');
    
// Список файлов, в которых нужно заменить ключи
const filesToProcess = ['./index.html', './templates/wedding-classic.html'];

console.log('Starting key replacement...');

const googleKey = process.env.GOOGLE_MAPS_API_KEY;
const jsonbinKey = process.env.JSONBIN_API_KEY;

if (!googleKey || !jsonbinKey) {
    console.error('Error: API keys not found in environment variables.');
    return process.exit(1);
}

// Теперь мы проходимся по каждому файлу в списке
filesToProcess.forEach(filePath => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`, err);
            return process.exit(1);
        }

        console.log(`Processing ${filePath}...`);
        // Выполняем обе замены для каждого файла
        let result = data.replace(/__GOOGLE_MAPS_API_KEY__/g, googleKey);
        result = result.replace(/__JSONBIN_API_KEY__/g, jsonbinKey);

        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${filePath}`, err);
                return process.exit(1);
            }
            console.log(`API keys have been successfully injected into ${filePath}.`);
        });
    });
});