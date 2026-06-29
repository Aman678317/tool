const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = path.join(__dirname, 'public', 'test-images');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const images = [
  { name: 'TestImage1.jpg', url: 'https://images.unsplash.com/photo-1578308698522-8646b9aeb692?q=80&w=600&auto=format&fit=crop' }, // Mona Lisa-ish / Portrait
  { name: 'TestImage2.jpg', url: 'https://images.unsplash.com/photo-1490750967868-88cb4ecb07cb?q=80&w=600&auto=format&fit=crop' }, // Flowers
  { name: 'TestImage3.jpg', url: 'https://images.unsplash.com/photo-1513622470522-26c308a3d289?q=80&w=600&auto=format&fit=crop' }, // Colorful village (Cinque Terre)
  { name: 'TestImage4.jpg', url: 'https://images.unsplash.com/photo-1552554761-0985289f660d?q=80&w=600&auto=format&fit=crop' }  // Landscape
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const img of images) {
    const dest = path.join(dir, img.name);
    console.log(`Downloading ${img.name}...`);
    try {
      await download(img.url, dest);
      console.log(`Saved ${img.name}`);
    } catch (e) {
      console.error(`Failed to download ${img.name}:`, e);
    }
  }
}

main();
