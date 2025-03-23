const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrls = [
  {
    name: 'fool.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg'
  },
  {
    name: 'magician.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'
  },
  {
    name: 'high-priestess.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/The_High_Priestess.jpg'
  },
  {
    name: 'star.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg'
  },
  {
    name: 'moon.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg'
  },
  {
    name: 'sun.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg'
  }
];

const downloadDirectory = path.join(__dirname, 'public', 'images');

// Ensure the directory exists
if (!fs.existsSync(downloadDirectory)) {
  fs.mkdirSync(downloadDirectory, { recursive: true });
  console.log(`Created directory: ${downloadDirectory}`);
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(downloadDirectory, filename);
    
    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File ${filename} already exists. Skipping download.`);
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

// Download all images sequentially
async function downloadAllImages() {
  console.log('Starting download of tarot card images...');
  
  for (const image of imageUrls) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error.message);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 