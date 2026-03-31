import sharp from 'sharp';

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const OUT_W = 2160;
const OUT_H = 2700; // 4:5

export async function processImage(inputPath, outputPath, options) {
  const borderSize = parseInt(options.border ?? 80, 10);

  const { data: rotatedBuffer } = await sharp(inputPath)
    .rotate()
    .toBuffer({ resolveWithObject: true });

  const contentW = OUT_W - borderSize * 2;
  const contentH = OUT_H - borderSize * 2;

  let finalBuffer;

  if (options.original) {
    const { data: fittedBuffer } = await sharp(rotatedBuffer)
      .resize({ width: contentW, height: contentH, fit: 'inside', withoutEnlargement: false })
      .png()
      .toBuffer({ resolveWithObject: true });

    const borderedBuffer = await sharp(fittedBuffer)
      .extend({ top: borderSize, bottom: borderSize, left: borderSize, right: borderSize, background: WHITE })
      .png()
      .toBuffer();

    const { width: bw, height: bh } = await sharp(borderedBuffer).metadata();
    const canvasLeft = Math.round((OUT_W - bw) / 2);
    const canvasTop = Math.round((OUT_H - bh) / 2);

    finalBuffer = await sharp({
      create: { width: OUT_W, height: OUT_H, channels: 4, background: WHITE },
    })
      .composite([{ input: borderedBuffer, left: canvasLeft, top: canvasTop }])
      .png()
      .toBuffer();

  } else {
    const croppedBuffer = await sharp(rotatedBuffer)
      .resize({ width: contentW, height: contentH, fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();

    finalBuffer = await sharp(croppedBuffer)
      .extend({ top: borderSize, bottom: borderSize, left: borderSize, right: borderSize, background: WHITE })
      .png()
      .toBuffer();
  }

  await sharp(finalBuffer)
    .jpeg({ quality: 95 })
    .toFile(outputPath);
}
