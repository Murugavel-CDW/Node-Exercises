import jwt from 'jsonwebtoken';
import ShortUniqueId from 'short-unique-id';
import BuddyService from "../services/buddyService.js";

class BuddyController {
    static #uid = new ShortUniqueId({length: 10}); 

    fetchBuddies = async (request, response, next) => {
        try {
            const buddiesData = await BuddyService.fetchBuddyList();
            response.status(200).send(buddiesData);
        } catch (err) {
            next(err); // passing to the error handler middleware
        }
    }

    signUpUser = async (request, response, next) => {
        try {
            const { realName : userName } = request.body;
            const user = await BuddyService.retrieveUser('realName', userName);
            if (user) { // if the user already exists
                return response.status(409).send("User with given name already exists");
            }
            const employeeId = BuddyController.#uid.rnd();
            const newUser = { employeeId, ...request.body }; // creating the newUser with employeeID and from the request body
            await BuddyService.addBuddy(newUser);
            const payload = {
                employeeId,
                userName
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "1h"
            });
            response.status(200).json({
                message: "User signed up successfully",
                token
            });
        } catch (err) {
            next(err);
        }
    }

    signinUser = async (request, response, next) => {
        try {
            const { userName } = request.body;
            const user = await BuddyService.retrieveUser(userName);
            if (!user) { // if the user doesn't exist
                return response.status(409).send("User with given name doesn't exist");
            }
            const payload = {
                employeeId: user.employeeId,
                userName
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: "1h"
            });
            response.status(200).json({
                message: "User signed in successfully",
                token
            });
        } catch (err) {
            next(err);
        }
    }

    fetchBuddy = async (request, response, next) => {
        try {
            const { employeeID } = request.params; 
            const buddyData = await BuddyService.fetchBuddy(employeeID);
            return buddyData;
        } catch (err) {
            next(err);
        }
    }

    updateBuddy = async (request, response, next) => {
        try {
            const { employeeID } = request.params;
            if (request.userID !== employeeID) { // if the employeeID doesn't match with the current user's ID
                return response.status(409).send("Cannot update other user's details");
            }
            await BuddyService.updateBuddy(employeeID, request.body);
            response.status(200).send("User Updated");
        } catch (err) {
            next(err);
        }
    }

    removeBuddy = async (request, response, next) => {
        try {
            const { employeeID } = request.params;
            if (request.userID !== employeeID) {
                return response.status(409).send("Cannot update other user's details");
            }
            await BuddyService.removeBuddy(employeeID);
            response.status(200).send("User deleted");
        } catch (err) {
            next(err);
        }
    }
}

export default BuddyController;