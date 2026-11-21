import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const BLOCKED_FILES = new Set([
  '/server.js',
  '/package.json',
  '/package-lock.json',
  '/bun.lock',
  '/bun.lockb',
  '/metadata.json',
]);

app.use((req, res, next) => {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(req.path);
  } catch {
    return res.status(400).send('Bad Request');
  }
  const normalizedPath = path.posix.normalize(decodedPath).toLowerCase();
  if (
    BLOCKED_FILES.has(normalizedPath) ||
    normalizedPath.startsWith('/node_modules') ||
    normalizedPath.split('/').some((segment) => segment.startsWith('.'))
  ) {
    return res.status(404).send('Not Found');
  }
  next();
});

app.use(express.static(__dirname, { index: 'index.html', dotfiles: 'deny' }));

app.use((req, res, next) => {
  if (req.method === 'GET') {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
