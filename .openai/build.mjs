import { cpSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
copyFileSync(path.join(root, 'index.html'), path.join(output, 'index.html'));
for (const directory of ['styles', 'scripts', 'assets']) {
  cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}
console.log('Static site files prepared in dist/.');
