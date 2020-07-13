var getPixels = require('get-pixels');

getPixels('page15_button_01.png', function(err, pixels) {
    if (err) {
        console.log('Bad image path');
        return;
    }
    console.log('got pixels', pixels.shape.slice());
});
