import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

// Build a separate Vercel output; keep the existing Sites publication intact.
const root = resolve(import.meta.dirname, '..');
const source = join(root, 'dist');
const output = join(root, 'vercel-dist');
const host = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
if (!host) throw new Error('Set SITE_URL or enable Vercel system environment variables.');
const url = new URL(host.startsWith('https://') || host.startsWith('http://') ? host : `https://${host}`);
if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('SITE_URL must use HTTP or HTTPS.');
const origin = url.origin;
const previousOrigin = 'https://adkea-creative-studio.musharraf772218.chatgpt.site';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
let updated = 0;
async function update(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) await update(file);
    else if (/\.(html|js|json|xml|txt)$/.test(entry.name)) {
      const content = await readFile(file, 'utf8');
      const next = content.replaceAll(previousOrigin, origin);
      if (next !== content) { await writeFile(file, next); updated++; }
    }
  }
}
await update(output);
console.log(`Vercel output prepared in vercel-dist; ${updated} files now use ${origin}.`);
