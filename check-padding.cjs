const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('public/frog-bird.png')
  .pipe(new PNG())
  .on('parsed', function() {
    let minX = this.width, minY = this.height, maxX = -1, maxY = -1;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        if (this.data[idx + 3] > 0) { // alpha > 0
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    console.log(`Image size: ${this.width}x${this.height}`);
    console.log(`Bounding box: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);
    console.log(`Right padding: ${this.width - 1 - maxX}`);
    console.log(`Bottom padding: ${this.height - 1 - maxY}`);
  });
