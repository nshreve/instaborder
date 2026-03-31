import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.avif']);

function isSupported(filePath) {
  return SUPPORTED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function expandDir(dirPath) {
  const files = fs.readdirSync(dirPath)
    .map(f => path.join(dirPath, f))
    .filter(f => fs.statSync(f).isFile() && isSupported(f));
  return files;
}

export async function resolveInputs(args) {
  const resolved = [];

  for (const arg of args) {
    // Check if it's an existing directory
    if (fs.existsSync(arg) && fs.statSync(arg).isDirectory()) {
      resolved.push(...expandDir(arg));
      continue;
    }

    // Try glob expansion
    const matches = await glob(arg, { absolute: true });

    if (matches.length === 0) {
      // Check if it's a literal file that doesn't exist
      if (!fs.existsSync(arg)) {
        console.warn(`Warning: No files found matching "${arg}"`);
      } else {
        const abs = path.resolve(arg);
        if (isSupported(abs)) {
          resolved.push(abs);
        } else {
          console.warn(`Warning: Unsupported format, skipping: ${abs}`);
        }
      }
      continue;
    }

    for (const match of matches) {
      if (fs.statSync(match).isDirectory()) {
        resolved.push(...expandDir(match));
      } else if (isSupported(match)) {
        resolved.push(match);
      } else {
        console.warn(`Warning: Unsupported format, skipping: ${match}`);
      }
    }
  }

  // Deduplicate
  return [...new Set(resolved)];
}
