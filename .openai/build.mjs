import { cpSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
mkdirSync(output, { recursive: true });
for (const file of ['hero-intro.js', 'hero-intro.css', 'hero-motion.js', 'bag-image-motion.js', 'bag-image-motion.css', 'media-hover.js', 'media-hover.css']) {
  rmSync(path.join(output, file), { force: true });
}
for (const file of ['index.html', 'styles.css', 'app.js', 'story-background.js', 'lookbook-scroll.css', 'lookbook-scroll.js', 'bags-scroll.css', 'bags-scroll.js', 'bag-photo-transition.js', 'commitment-journey.css', 'commitment-journey.js', 'badlands-motion.css', 'badlands-motion.js', 'footer-physics.js', 'cta-unified.css', 'collection-hover.css']) {
  copyFileSync(path.join(root, file), path.join(output, file));
}
cpSync(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log('Static site files prepared in dist/.');
