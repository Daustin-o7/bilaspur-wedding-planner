const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.aac': 'audio/aac' };
types['.woff2'] = 'font/woff2';
function createServer(design = 'wine') {
  if (!['forest', 'wine'].includes(design)) throw new Error('Choose forest or wine.');
  const root = path.join(__dirname, design);
  return http.createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end('Local preview does not collect RSVPs.'); return; }
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(root + path.sep)) { response.writeHead(403); response.end('Forbidden'); return; }
      const contents = await fs.readFile(file);
      response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(request.method === 'HEAD' ? undefined : contents);
    } catch (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 400); response.end('File not found or invalid path.'); }
  });
}
if (require.main === module) {
  const design = process.argv[2] || 'wine';
  const port = design === 'forest' ? 4175 : 4174;
  const server = createServer(design);
  server.on('error', error => { console.error(`Preview could not start: ${error.message}`); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`${design}: http://127.0.0.1:${port}\nEditor: http://127.0.0.1:${port}/editor.html`));
}
module.exports = { createServer };
