import fs from 'fs/promises';
import CustomError from '../customError.js';

class BuddyService{
    static #fetchDetailsList = () => {
        return fs.readFile('./data/cdw_ace25_buddies.json');
    }

    static #retrieveUser = (userID, userList) => {
        const user = userList.find((userData) => userData.employeeId === userID);
        return user;
    }

    static #retrieveUserIndex = (userID, userList) => {
        const userIndex = userList.findIndex((userData) => userData.employeeId === userID);
        return userIndex;
    }

    static fetchBuddyList = async () => {
        const buddyList = (await BuddyService.#fetchDetailsList()).toString();
        return buddyList;
    }

    static fetchBuddy = async (employeeID) => {
        const buddyList = JSON.parse((await BuddyService.#fetchDetailsList()).toString());
        return BuddyService.#retrieveUser(employeeID, buddyList);
    }

    static addBuddy = async (userData) => {
        const { employeeId, realName, nickName, dob, hobbies } = userData;
        if (!employeeId || !realName || !nickName || !dob || !hobbies) {
            throw new CustomError("All fields are required", 400);
        }
        const buddyList = JSON.parse((await BuddyService.#fetchDetailsList()).toString());
        buddyList.push(userData);
        const dataToAppend = JSON.stringify(buddyList);
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend);
    }

    static updateBuddy = async (employeeID, userData) => {
        const buddyList = JSON.parse((await BuddyService.#fetchDetailsList()).toString());
        const buddyIndex = BuddyService.#retrieveUserIndex(employeeID, buddyList);
        if (buddyIndex == -1) {
            throw new CustomError("User with no such employee ID found", 404);
        }
        buddyList[buddyIndex] = { ...buddyList[buddyIndex], ...userData };
        const dataToAppend = JSON.stringify(buddyList);
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend);
    }

    static removeBuddy = async (employeeID) => {
        const buddyList = JSON.parse((await BuddyService.#fetchDetailsList()).toString());
        const buddyIndex = BuddyService.#retrieveUserIndex(employeeID, buddyList);
        if (buddyIndex == -1) {
            throw new CustomError("User with no such employee ID found", 404);
        }
        buddyList.splice(buddyIndex, 1);
        const dataToAppend = JSON.stringify(buddyList);
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend);
    }
}

export default BuddyService;