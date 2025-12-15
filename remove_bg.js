const fs = require('fs');
const { PNG } = require('pngjs');

const inputFile = '/Users/ziyi.zhang/.gemini/antigravity/brain/90f2230f-6df1-43b7-87ea-796afdc9b743/pokelearn_logo_v29_1765591866444.png';
const outputFile = 'src/assets/banner_transparent.png';

fs.createReadStream(inputFile)
  .pipe(new PNG())
  .on('parsed', function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;

        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // If pixel is white (or very close to white)
        if (r > 240 && g > 240 && b > 240) {
          this.data[idx + 3] = 0; // Set Alpha to 0
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(outputFile))
      .on('finish', () => console.log('Done!'));
  });
