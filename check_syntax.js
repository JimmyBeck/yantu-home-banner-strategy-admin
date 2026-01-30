const fs = require('fs');
const html = fs.readFileSync('管理后台_离线版.html', 'utf8');
// This regex is simple and might fail on nested scripts strings, but good enough for structure check
const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let match;
let i = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    const content = match[1];
    console.log(`Checking script ${i} (length: ${content.length})...`);
    try {
        // Use node's vm module to check syntax
        const vm = require('vm');
        new vm.Script(content);
        console.log(`Script ${i} is VALID.`);
    } catch (e) {
        console.error(`Script ${i} INVALID: ${e.message}`);
        // Show the line causing error if possible
        if (e.stack) {
             const stackLines = e.stack.split('\n');
             console.log(stackLines[0]);
        }
        console.log('Start of script:', content.substring(0, 100));
    }
    i++;
}
