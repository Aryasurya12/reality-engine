const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, 'public', 'images');

async function processImage(filename) {
    const filePath = path.join(publicImagesDir, filename);
    if (!fs.existsSync(filePath)) return;
    
    console.log(`Processing ${filename}...`);
    try {
        const image = await Jimp.read(filePath);
        
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            // Get RGB values
            var red   = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue  = this.bitmap.data[idx + 2];
            
            // Calculate brightness
            var brightness = (red + green + blue) / 3;
            
            let alpha = 0;
            if (brightness > 10) { 
                alpha = Math.min(255, Math.pow(brightness / 255, 0.7) * 255);
            }
            
            this.bitmap.data[idx + 3] = alpha;
        });
        
        await image.writeAsync(filePath);
        console.log(`Successfully made ${filename} transparent!`);
    } catch (err) {
        console.error(`Error processing ${filename}:`, err);
    }
}

async function run() {
    await processImage('invention_eye.png');
    await processImage('invention_brain.png');
    await processImage('invention_automaton.png');
    console.log('All done!');
}

run();
