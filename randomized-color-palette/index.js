import fs from 'fs';

const paletteJSONString = fs.readFileSync('color_palette.json').toString(); // reading data from the file
const paletteData = JSON.parse(paletteJSONString);
const paletteDataLength = paletteData.length;

const randomizedPalettes = [];
const paletteSet = new Set(); // set data structure to keep track of unique values

while (paletteSet.size < 5) {
    const randomIndex = Math.ceil(Math.random() * (paletteDataLength - 1)); // generating a random index within the length of the array
    if (!paletteSet.has(randomIndex)) { // if the index is not present in the set
        paletteSet.add(randomIndex); 
        randomizedPalettes.push(paletteData[randomIndex]);
    }
}

const randomizedPaletteString = JSON.stringify(randomizedPalettes);

fs.writeFileSync('randomized_color_palette.json', randomizedPaletteString); // writing the new array into the file

const randomizedPaletteJSONString = fs.readFileSync('randomized_color_palette.json').toString(); // reading data from the new file
const randomizedPaletteData = JSON.parse(randomizedPaletteJSONString);

randomizedPaletteData.forEach((palette) => console.log(palette));