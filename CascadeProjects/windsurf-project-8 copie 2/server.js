const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

const proxy = httpProxy.createProxyServer({});
const PORT = 9000;

const server = http.createServer((req, res) => {
  // Proxy requests to /applistgenerator and Next.js assets to Next.js server
  if (req.url.startsWith('/applistgenerator') || 
      req.url.startsWith('/_next') || 
      req.url.startsWith('/api')) {
    
    // Remove /applistgenerator prefix for Next.js
    if (req.url.startsWith('/applistgenerator')) {
      req.url = req.url.replace('/applistgenerator', '');
      if (req.url === '') req.url = '/';
    }
    
    proxy.web(req, res, { 
      target: 'http://localhost:3001',
      changeOrigin: true
    });
  } else {
    // Serve static files from current directory
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
      '.webp': 'image/webp'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end('<h1>404 Not Found</h1>', 'utf-8');
        } else {
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Landing page: http://localhost:${PORT}/`);
  console.log(`App generator: http://localhost:${PORT}/applistgenerator`);
});
