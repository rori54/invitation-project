const fs = require('fs');
const filesToProcess = ['./index.html', './templates/wedding-classic.html'];

console.log('Starting key replacement...');

const googleKey = process.env.GOOGLE_MAPS_API_KEY;
const jsonbinMasterKey = process.env.JSONBIN_MASTER_KEY;
const jsonbinAccessKey = process.env.JSONBIN_ACCESS_KEY;

if (!googleKey || !jsonbinMasterKey || !jsonbinAccessKey) {
    console.error('Error: One or more API keys not found in environment variables.');
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
        result = result.replace(/__JSONBIN_MASTER_KEY__/g, jsonbinMasterKey);
        result = result.replace(/__JSONBIN_ACCESS_KEY__/g, jsonbinAccessKey);

        fs.writeFile(filePath, result, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${filePath}`, err);
                return process.exit(1);
            }
            console.log(`API keys have been successfully injected into ${filePath}.`);
        });
    });
});