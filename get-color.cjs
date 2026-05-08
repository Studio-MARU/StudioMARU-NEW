const Jimp = require('jimp');

Jimp.read('public/bird-wing.png')
  .then(image => {
    const hex = image.getPixelColor(0, 0);
    console.log('Color:', hex.toString(16));
  })
  .catch(err => {
    console.error(err);
  });
