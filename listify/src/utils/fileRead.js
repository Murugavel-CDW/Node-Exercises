import fs from 'fs/promises';
import path from 'path';

// Function to read and return the task List from the json file
export const fileDetailsRead = async (fileName) => {
    const usersList = await fs.readFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`));
    return JSON.parse(usersList);
}