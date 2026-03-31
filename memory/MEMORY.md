# terminal-border project memory

## Project
CLI tool at `/Users/noahshreve/Documents/Projects/apps/terminal-border` — renamed to **instaborder**, globally linked as `instaborder`. Adds white borders to images, always outputs 4:5 (2160×2700 JPEG) for Instagram.

## Key files
- `index.js` — CLI entry (Commander)
- `src/processor.js` — Sharp pipeline
- `src/resolver.js` — glob/dir input expansion
- `src/output.js` — output path computation (always `_ig.jpg` suffix)

## CLI options (v2, simplified)
- Default: crop+scale to fill 4:5 (cover), add border → output `_ig.jpg`
- `-b <px>`: border size (default 80)
- `-f` / `--fit`: fit original aspect ratio inside 4:5 with white space

## Sharp gotcha (important)
Sharp applies `resize()` BEFORE `composite()` in its internal pipeline. When combining canvas composite and resize, you MUST use explicit buffer intermediates — get a buffer from each step, pass it to the next `sharp()` call. Do NOT chain `.composite().resize()` in one pipeline.

Also: intermediate `.toBuffer()` calls must include `.png()` before them, otherwise Sharp returns raw pixel data that it can't re-read from a buffer.
