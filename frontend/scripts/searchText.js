const fs = require('fs');
const path = require('path');

function findAndCopyLine(directoryPath, searchText) {
  let copiedLines = [];

  function readDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        readDirectory(filePath);
      } else if (stats.isFile()) {
        const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].includes(searchText)) {
            copiedLines.push(file.trim());
            copiedLines.push(lines[i ].trim());
          }
        }
      }
    }
  }

  readDirectory(directoryPath);
  return copiedLines;
}

const directoryPath = process.argv[2];
const searchText = process.argv[3];

if (!directoryPath || !searchText) {
  console.log('Usage: node script.js <directoryPath> <searchText>');
  process.exit(1);
}

const copiedLines = findAndCopyLine(directoryPath, searchText);
console.log('Copied lines:', copiedLines);