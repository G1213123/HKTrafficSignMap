const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Read app/page.js
const pageJsPath = path.join(__dirname, '..', 'app', 'page.js');
let pageJsContent = fs.readFileSync(pageJsPath, 'utf8');

// Replace the version number
// The regex looks for <span className="version-number"> followed by any content (lazy) until </span>
const versionRegex = /(<span className="version-number">)([\s\S]*?)(<\/span>)/;

if (versionRegex.test(pageJsContent)) {
    const newContent = pageJsContent.replace(versionRegex, `$1\n                                        v${version}\n                                    $3`);
    fs.writeFileSync(pageJsPath, newContent, 'utf8');
    console.log(`Updated version to v${version} in app/page.js`);
} else {
    console.error('Could not find version number span in app/page.js');
    process.exit(1);
}
