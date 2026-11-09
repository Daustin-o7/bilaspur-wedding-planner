const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
fs.copyFileSync('site/core.js', 'apps-script/Core.gs');
fs.mkdirSync('site/google-setup', { recursive: true });
for (const file of ['Code.gs', 'Core.gs', 'appsscript.json']) fs.copyFileSync('apps-script/' + file, 'site/google-setup/' + file + '.txt');
execFileSync(process.execPath, ['node_modules/tailwindcss/lib/cli.js', '-i', 'site/assets/tailwind.css', '-o', 'site/assets/style.css', '--minify'], { stdio: 'inherit' });
