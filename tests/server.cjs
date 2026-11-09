const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve('site');
http.createServer((req, res) => {
  const file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname.replace(/\/$/, '/index.html'));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg'})[path.extname(file)] || 'text/plain');
    res.end(data);
  });
}).listen(4173, '127.0.0.1');
