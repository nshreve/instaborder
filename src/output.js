import fs from 'fs';
import path from 'path';

export function computeOutputPath(inputPath) {
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  const filename = `${base}_ig.jpg`;
  const dir = path.dirname(inputPath);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, filename);
}
