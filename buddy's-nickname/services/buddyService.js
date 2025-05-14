import fs from 'fs/promises';
import CustomError from '../customError.js';

class BuddyService{
    // Private method to return a list of users
    static #fetchDetailsList = async () => {
        return (await fs.readFile('./data/cdw_ace25_buddies.json')).toString(); // returns the string data from the read file
    }

    // Private method to return a specific user
    static #retrieveUser = (userID, userList) => {
        const user = userList.find((userData) => userData.employeeId === userID);
        return user;
    }

    // Private method to return the index of a specific user
    static #retrieveUserIndex = (userID, userList) => {
        const userIndex = userList.findIndex((userData) => userData.employeeId === userID);
        return userIndex;
    }

    static fetchBuddyList = async () => {
        const buddyList = await BuddyService.#fetchDetailsList();
        return buddyList;
    }

    static fetchBuddy = async (employeeID) => {
        const buddyList = JSON.parse(await BuddyService.#fetchDetailsList());
        const buddyDetails = BuddyService.#retrieveUser(employeeID, buddyList);
        if (!buddyDetails) { // if no buddy is found
            throw new CustomError("User with no such employee ID found", 404);
        }
        return buddyDetails;
    }

    static addBuddy = async (userData) => {
        const { employeeId, realName, nickName, dob, hobbies } = userData;
        if (!employeeId || !realName || !nickName || !dob || !hobbies) { // if any of the required field is empty (i.e) undefined
            throw new CustomError("All fields are required", 400);
        }
        const buddyList = JSON.parse(await BuddyService.#fetchDetailsList());
        buddyList.push(userData); // adding the data to the user array
        const dataToAppend = JSON.stringify(buddyList); // converting the json array into a stringified form
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend); // overwriting the data into the file
    }

    static updateBuddy = async (employeeID, userData) => {
        const buddyList = JSON.parse(await BuddyService.#fetchDetailsList());
        const buddyIndex = BuddyService.#retrieveUserIndex(employeeID, buddyList);
        if (buddyIndex == -1) {
            throw new CustomError("User with no such employee ID found", 404);
        }
        // copying the values from the existing entry along with modified data
        buddyList[buddyIndex] = { ...buddyList[buddyIndex], ...userData };
        const dataToAppend = JSON.stringify(buddyList);
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend);
    }

    static removeBuddy = async (employeeID) => {
        const buddyList = JSON.parse(await BuddyService.#fetchDetailsList());
        const buddyIndex = BuddyService.#retrieveUserIndex(employeeID, buddyList);
        if (buddyIndex == -1) { // if user is not foundr
            throw new CustomError("User with no such employee ID found", 404);
        }
        buddyList.splice(buddyIndex, 1);
        const dataToAppend = JSON.stringify(buddyList);
        await fs.writeFile('./data/cdw_ace25_buddies.json', dataToAppend);
    }
}

export default BuddyService;