const fs = require('fs');
const PNG = require('pngjs').PNG;

fs.createReadStream('public/bird-wing.png')
  .pipe(new PNG())
  .on('parsed', function() {
    const idx = 0; // top-left pixel
    const r = this.data[idx];
    const g = this.data[idx + 1];
    const b = this.data[idx + 2];
    const a = this.data[idx + 3];
    console.log(`Color: rgba(${r}, ${g}, ${b}, ${a})`);
    console.log(`Hex: #${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  });
