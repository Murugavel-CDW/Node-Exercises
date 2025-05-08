import fs from 'fs';

const paletteJSONString = fs.readFileSync('color_palette.json').toString();
const paletteData = JSON.parse(paletteJSONString);
const paletteDataLength = paletteData.length;

const randomizedPalettes = [];
const paletteSet = new Set();

while (paletteSet.size < 5) {
    const randomIndex = Math.ceil(Math.random() * (paletteDataLength - 1));
    if (!paletteSet.has(randomIndex)) {
        paletteSet.add(randomIndex);
        randomizedPalettes.push(paletteData[randomIndex]);
    }
}

const randomizedPaletteString = JSON.stringify(randomizedPalettes);

fs.writeFileSync('randomized_color_palette.json', randomizedPaletteString);

const randomizedPaletteJSONString = fs.readFileSync('randomized_color_palette.json').toString();
const randomizedPaletteData = JSON.parse(randomizedPaletteJSONString);

randomizedPaletteData.forEach((palette) => console.log(palette));