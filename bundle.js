const fs = require('fs');

// Read source file
let html = fs.readFileSync('管理后台.html', 'utf8');

// Read resources
const tailwind = fs.readFileSync('tailwind.js', 'utf8');
const vue = fs.readFileSync('vue.js', 'utf8');
const fa = fs.readFileSync('fontawesome.js', 'utf8');

// Helper to escape closing script tags in JS content
function escapeScript(content) {
    // Escape </script to <\/script to prevent breaking out of the script tag
    // Also escape <!-- to <\!-- to avoid HTML parser confusion
    return content.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
}

// Replace Tailwind
// Use a function for replacement to avoid $ patterns being interpreted
html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', () => '<script>\n' + escapeScript(tailwind) + '\n</script>');
// html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', () => '<!-- Tailwind removed -->');

// Replace Vue
html = html.replace('<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>', () => '<script>\n' + escapeScript(vue) + '\n</script>');
// html = html.replace('<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>', () => '<!-- Vue removed -->');

// Replace FontAwesome (Link -> Script)
// Note: Replacing CSS link with JS version of FontAwesome for offline compatibility (SVG mode)
html = html.replace('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">', () => '<script>\n' + escapeScript(fa) + '\n</script>');
// html = html.replace('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">', () => '<!-- FA removed for debugging -->');

// Write output
fs.writeFileSync('管理后台_离线版.html', html);
console.log('Build complete: 管理后台_离线版.html created.');
