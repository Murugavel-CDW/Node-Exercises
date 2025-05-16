import fs from 'fs/promises';
import path from 'path';
import { fileDetailsRead } from './fileRead.js';

export const fileDetailsWrite = async (fileName, data, shouldReplace = false) => {
    if (shouldReplace) {
        await fs.writeFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`), JSON.stringify(data));
    } else {
        const dataList = await fileDetailsRead(fileName);
        dataList.push(data);
        await fs.writeFile(path.resolve(import.meta.dirname, `../data/${fileName}.json`), JSON.stringify(dataList));
    }
}