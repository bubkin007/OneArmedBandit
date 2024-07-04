const fs = require('fs');
const path = require('path');

const symbolsDir = path.join(__dirname, './src/assets/symbols');
const outputFilePath = path.join(__dirname, 'symbolsList.js');

fs.readdir(symbolsDir, (err, files) => {
  if (err) {
    console.error('Error reading symbols directory:', err);
    return;
  }

  const symbols = files
    .filter(file => path.extname(file) === '.svg')
    .map(file => path.basename(file, '.svg'));

  const outputContent = `export const symbols = ${JSON.stringify(symbols, null, 2)};\n`;

  fs.writeFile(outputFilePath, outputContent, (err) => {
    if (err) {
      console.error('Error writing symbols list file:', err);
      return;
    }

    console.log('Symbols list generated successfully!');
  });
});
