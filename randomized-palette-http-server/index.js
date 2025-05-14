import http from 'http';
import fs from 'fs';

const pickRandomizedData = (paletteData) => {
    const paletteDataLength = paletteData.length;
    const randomizedPalettes = [];
    const paletteSet = new Set(); // set data structure to track unique elements
    while (paletteSet.size < 5) {
        const randomIndex = Math.ceil(Math.random() * (paletteDataLength - 1)); // picking a random index
        if (!paletteSet.has(randomIndex)) { // if the index is not present in the set
            paletteSet.add(randomIndex);
            randomizedPalettes.push(paletteData[randomIndex]);
        }
    }
    return JSON.stringify(randomizedPalettes);
}

const port = 3000;

const server = http.createServer((request, response) => {
    if (request.url == '/' && request.method == 'GET') {
        fs.readFile('color_palette.json', (err, data) => {
            if (err) { // if any error occurs
                response.write(`Error occurred while reading into the data ${err.message}`);
                response.statusCode = 500;
                response.end();
                return;
            }
            const paletteData = JSON.parse(data.toString());
            const randomizedPaletteData = pickRandomizedData(paletteData);
            response.write(randomizedPaletteData);
            response.end();
        })
    }
});

server.listen(port);
