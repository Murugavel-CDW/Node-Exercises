import BuddyService from "../services/buddyService.js";

class BuddyController {
    fetchBuddies = async (request, response, next) => {
        try {
            const buddiesData = await BuddyService.fetchBuddyList();
            response.status(200).send(buddiesData);
        } catch (err) {
            next(err); // passing to the error handler middleware
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

    addBuddy = async (request, response, next) => {
        try {
            await BuddyService.addBuddy(request.body);
            response.status(201).send("Buddy created");
        } catch (err) {
            next(err);
        }
    }

    updateBuddy = async (request, response, next) => {
        try {
            const { employeeID } = request.params;
            await BuddyService.updateBuddy(employeeID, request.body);
            response.status(200).send("User Updated");
        } catch (err) {
            next(err);
        }
    }

    removeBuddy = async (request, response, next) => {
        try {
            const { employeeID } = request.params;
            await BuddyService.removeBuddy(employeeID);
            response.status(200).send("User deleted");
        } catch (err) {
            next(err);
        }
    }
}

export default BuddyController;