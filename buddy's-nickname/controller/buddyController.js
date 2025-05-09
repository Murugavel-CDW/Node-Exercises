import CustomError from "../customError.js";
import BuddyService from "../services/buddyService.js";

class BuddyController {
    fetchBuddies = async (request, response) => {
        try {
            const buddiesData = await BuddyService.fetchBuddyList();
            response.status(200).send(buddiesData);
        } catch (err) {
            response.status(500).send(`Internal server error: ${err.message}`);
        }
    }

    fetchBuddy = async (request, response) => {
        try {
            const { employeeID } = request.params; 
            const buddyData = await BuddyService.fetchBuddy(employeeID);
            if (buddyData) {
                response.status(200).send(buddyData);
            } else {
                response.status(404).send("User with given employee ID not found");
            }
        } catch (err) {
            response.status(500).send(`Internal server error: ${err.message}`);
        }
    }

    addBuddy = async (request, response) => {
        try {
            await BuddyService.addBuddy(request.body);
            response.status(201).send("Buddy created");
        } catch (err) {
            if (err instanceof CustomError) {
                response.status(err.status).send(err.message);
                return;
            }
            response.status(500).send(`Internal server error: ${err.message}`);
        }
    }

    updateBuddy = async (request, response) => {
        try {
            const { employeeID } = request.params;
            await BuddyService.updateBuddy(employeeID, request.body);
            response.status(200).send("User Updated");
        } catch (err) {
            if (err instanceof CustomError) {
                response.status(err.status).send(err.message);
                return;
            }
            response.status(500).send(`Internal server error: ${err.message}`);
        }
    }

    removeBuddy = async (request, response) => {
        try {
            const { employeeID } = request.params;
            await BuddyService.removeBuddy(employeeID);
            response.status(200).send("User deleted");
        } catch (err) {
            if (err instanceof CustomError) {
                response.status(err.status).send(err.message);
                return;
            }
            response.status(500).send(`Internal server error: ${err.message}`);
        }
    }
}

export default BuddyController;