const Jimp = require('jimp');

const inputFile = '/Users/ziyi.zhang/.gemini/antigravity/brain/90f2230f-6df1-43b7-87ea-796afdc9b743/uploaded_image_1765592622549.jpg';
const outputFile = 'src/assets/logo_psyduck_transparent.png';

async function process() {
  console.log('Reading image...');
  const image = await Jimp.read(inputFile);

  console.log('Processing transparency...');
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // Threshold for white (adjust if needed, >230 is usually safe for pure white)
    if (r > 230 && g > 230 && b > 230) {
      this.bitmap.data[idx + 3] = 0; // Alpha 0
    }
  });

  console.log('Saving...');
  await image.writeAsync(outputFile);
  console.log('Done: ' + outputFile);
}

process().catch(console.error);
