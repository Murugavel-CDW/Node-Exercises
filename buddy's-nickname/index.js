import fs from 'fs';
import express from 'express';
import buddyRouter from './routes/buddyRoute.js';

const port = 3000;
const app = express();
app.use(express.json());

app.get('/', (request, response) => {
    response.send("Welcome to express app");
});

app.use('/buddies', buddyRouter);

app.listen(port, () => {
    fs.writeFile('./data/cdw_ace25_buddies.json', '[]', err => {
        if (err) {
            console.log(`Error while reading into the file. ${err.message}`);
        }
    });
    console.log(`Listening on port: ${port}`);
});