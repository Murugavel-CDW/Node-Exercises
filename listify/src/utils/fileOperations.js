import fs from 'fs/promises';
import path from 'path';

// Function to read and return the task List from the json file
export const fileDetailsRead = async (fileName) => {
    const usersList = await fs.readFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`));
    return JSON.parse(usersList);
}

// Function to write the data into the json file
export const fileDetailsWrite = async (fileName, data, shouldReplace = false) => {
    if (shouldReplace) { // checking for the flag which denotes if the whole data needs to be replaced
        await fs.writeFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`), JSON.stringify(data));
    } else {
        const dataList = await fileDetailsRead(fileName);
        dataList.push(data);
        await fs.writeFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`), JSON.stringify(dataList));
    }
}