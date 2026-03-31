# instaborder

CLI tool that adds white borders to images and formats them for Instagram's 4:5 aspect ratio (1080×1350). Output is always 2160×2700 (2× for Retina displays).

## Install

```bash
npm install -g instaborder
```

## Usage

```
instaborder [options] <input...>
```

`<input>` can be one or more image files, glob patterns, or a directory.

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-b, --border <px>` | Border size in pixels | `80` |
| `-o, --original` | Preserve original aspect ratio (letterbox) | off |
| `-h, --help` | Show help | |

### Default behavior

Crops and scales your image to fill the 4:5 frame, then adds a white border. The center of the image is kept.

### With `--original`

Fits the entire image inside the 4:5 frame without cropping, filling any remaining space with white. Use this when you don't want any part of the image cut off.

### Output files

Each file is saved alongside the original with `_ig` appended before the extension:

```
photo.jpg  →  photo_ig.jpg
```

## Examples

```bash
# Single file (default crop mode)
instaborder photo.jpg

# Larger border
instaborder -b 120 photo.jpg

# Preserve full image, no cropping
instaborder --original photo.jpg

# Batch — all JPEGs in current directory
instaborder *.jpg

# Entire folder
instaborder ./photos/

# Combine options
instaborder --original -b 100 ./photos/
```

## Supported formats

JPEG, PNG, WebP, TIFF, AVIF

## How it works

1. **Auto-orient** — reads EXIF rotation so the image is always upright before processing
2. **Scale to fit** — resizes to fill (or fit inside, with `--original`) the content area
3. **Add border** — extends the image with white pixels on all sides
4. **Composite** (with `--original`) — centers the bordered image on a full 4:5 white canvas
5. **Save** — writes a JPEG at 95% quality
