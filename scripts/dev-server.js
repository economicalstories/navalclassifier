import { createServer } from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.argv[2] ?? '.';
const port = Number(process.argv[3] ?? 5173);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

createServer(async (request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url ?? '/', `http://localhost:${port}`).pathname);
  const safePath = normalize(urlPath).replace(/^\.\.(\/|\\|$)/, '');
  let filePath = join(root, safePath === '/' ? 'index.html' : safePath);
  if (!existsSync(filePath) || (await stat(filePath)).isDirectory()) filePath = join(root, 'index.html');
  response.writeHead(200, { 'Content-Type': types[extname(filePath)] ?? 'application/octet-stream' });
  createReadStream(filePath).pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`Serving ${root} on http://0.0.0.0:${port}`);
});
