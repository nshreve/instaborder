#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { resolveInputs } from './src/resolver.js';
import { computeOutputPath } from './src/output.js';
import { processImage } from './src/processor.js';

program
  .name('instaborder')
  .description('Add white borders to images for Instagram (4:5, 2160×2700)')
  .argument('<input...>', 'Image files, glob patterns, or a directory')
  .option('-b, --border <px>', 'Border size in pixels', '80')
  .option('-o, --original', 'Fit original aspect ratio inside the 4:5 frame (adds white space)')
  .addHelpText('after', `
Default: crops and scales to fill the 4:5 frame, then adds a border.
  -o / --original: preserves the original aspect ratio with white space on the sides.

Output is always 2160×2700 (2× Instagram 1080×1350).

Examples:
  instaborder photo.jpg
  instaborder -b 120 photo.jpg
  instaborder --original photo.jpg
  instaborder *.jpg
`);

program.parse();

const opts = program.opts();
const args = program.args;

const files = await resolveInputs(args);

if (files.length === 0) {
  console.error('No supported image files found.');
  process.exit(1);
}

let processed = 0;
let skipped = 0;

for (const inputPath of files) {
  const outputPath = computeOutputPath(inputPath, opts);

  if (path.resolve(inputPath) === path.resolve(outputPath)) {
    console.warn(`Skipping ${path.basename(inputPath)}: output would overwrite input`);
    skipped++;
    continue;
  }

  try {
    await processImage(inputPath, outputPath, opts);
    processed++;
  } catch (err) {
    console.error(`Error: ${path.basename(inputPath)}: ${err.message}`);
    skipped++;
  }
}

const parts = [`Processed ${processed} image${processed !== 1 ? 's' : ''}`];
if (skipped > 0) parts.push(`${skipped} skipped`);
console.log(parts.join(', '));
