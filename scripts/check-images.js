const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'tarot');

let hasIssue = false;

for (const file of fs.readdirSync(dir)) {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(file).toLowerCase();
  const magic = buffer.slice(0, 4).toString('hex');

  const isJpeg = magic.startsWith('ffd8');
  const isPng = magic === '89504e47';

  if (ext === '.jpg' || ext === '.jpeg') {
    if (!isJpeg) {
      console.error(`❌ ${file} does not have a valid JPEG header`);
      hasIssue = true;
    }
  } else if (ext === '.png') {
    if (!isPng) {
      console.error(`❌ ${file} does not have a valid PNG header`);
      hasIssue = true;
    }
  } else {
    console.error(`❌ Unexpected file type: ${file}`);
    hasIssue = true;
  }

  const text = buffer.toString('utf8');
  if (/data:image|base64|<script|<html/i.test(text)) {
    console.error(`❌ Embedded content detected in ${file}`);
    hasIssue = true;
  }
}

if (hasIssue) {
  console.error('Image validation failed.');
  process.exit(1);
} else {
  console.log('All tarot images validated successfully.');
}
