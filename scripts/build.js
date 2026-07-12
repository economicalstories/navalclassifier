import { cp, mkdir, rm } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src/game', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src/main.js', 'dist/src/main.js');
await cp('src/styles.css', 'dist/src/styles.css');
await cp('src/game/boats.js', 'dist/src/game/boats.js');
await cp('src/game/scoring.js', 'dist/src/game/scoring.js');
console.log('Built static app to dist/');
