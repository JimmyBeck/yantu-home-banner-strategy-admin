const https = require('https');
const fs = require('fs');
const path = require('path');

const resources = [
    {
        name: 'tailwind.js',
        url: 'https://cdn.tailwindcss.com'
    },
    {
        name: 'vue.js',
        url: 'https://unpkg.com/vue@3/dist/vue.global.js'
    },
    {
        name: 'fontawesome.js',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js'
    }
];

const downloadFile = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const request = https.get(url, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                let newUrl = response.headers.location;
                if (!newUrl.startsWith('http')) {
                    const parsedUrl = new URL(url);
                    newUrl = `${parsedUrl.protocol}//${parsedUrl.host}${newUrl}`;
                }
                downloadFile(newUrl, filepath)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => {}); // Delete the empty file
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded ${filepath}`);
                    resolve();
                });
            });
        });
        
        request.on('error', (err) => {
            file.close();
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
};

async function downloadAll() {
    console.log('Starting downloads...');
    try {
        for (const res of resources) {
            await downloadFile(res.url, path.join(__dirname, res.name));
        }
        console.log('All downloads complete.');
    } catch (error) {
        console.error('Download error:', error);
    }
}

downloadAll();
