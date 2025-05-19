import {
    createNewTask, fetchTaskDetails, fetchUserTasks, filterTasks, removeTask, sliceTasks, sortTasks, updateTaskDetails
} from "../services/task.service.js";

// Function to create a new task and return the response
export const createTask = async (request, response, next) => {
    try {
        const userId = request.userId; // retrieving the user id from the request object
        const createdTask = await createNewTask(userId, request.body);
        response.status(201).json({
            message: "Task created successfully",
            taskId: createdTask.taskId
        });
    } catch (error) {
        next(error);
    }
}

// Function to fetch the list of tasks created by the user and return it as response
export const fetchTasks = async (request, response, next) => {
    try {
        const { sortBy, order = 'asc', page = 1, limit = 5, ...filterCriteria} = request.query;
        const userId = request.userId;

        let userCreatedTasks = await fetchUserTasks(userId);
        userCreatedTasks = filterTasks(userCreatedTasks, filterCriteria);
        userCreatedTasks = sortTasks(userCreatedTasks, sortBy, order);
        const { tasks, tasksLeft } = sliceTasks(userCreatedTasks, page, limit);

        if (tasks.length > 0) { // if any task that satisfies all criteria is found
            response.status(200).json({
                tasks,
                tasksLeft// to help the ui indicate if there are any further tasks to display
            });
        } else {
            response.status(200).send("No tasks to display");
        }
    } catch (error) {
        next(error);
    }
}

// Function to return a task having taskId as response
export const fetchTask = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { taskId } = request.params; 
        const taskDetails = await fetchTaskDetails(taskId);
        if (taskDetails) {
            if (taskDetails.createdBy === userId) { // if the task to be viewed was created by the current user
                const { taskId, createdBy, ...taskData } = taskDetails;
                response.status(200).send(taskData);
            } else {
                response.status(403).send("Access to view this task is denied");
            }
        } else {
            response.status(404).send("Task could not be found");
        }
    } catch (error) {
        next(error);
    }
}

// Function to update the task and return the response
export const updateTask = async (request, response, next) => {
    try {
        if (!request.body) { // if no data is provided to update
            return response.status(400).send("Provide necessary fields to update");
        }
        const userId = request.userId;
        const { taskId } = request.params; // retrieving the task id from the params
        const taskDetails = await fetchTaskDetails(taskId);
        if (taskDetails) { // if any task is found
            if (taskDetails.createdBy === userId) {
                await updateTaskDetails(taskId, request.body);
                response.status(200).send("Task updated successfully");
            } else {
                response.status(403).send("Access to update this task is denied")
            }
        } else {
            response.status(404).send("Task could not be found");
        }
    } catch (error) {
        next(error);
    }
}

// Function to delete the task and return response if it is deleted
export const deleteTask = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { taskId } = request.params; 
        const taskDetails = await fetchTaskDetails(taskId);
        if (taskDetails) {
            if (taskDetails.createdBy === userId) {
                await removeTask(taskId);
                response.status(200).send("Task deleted successfully");
            } else {
                response.status(403).send("Access to delete this task is denied")
            }
        } else {
            response.status(404).send("Task could not be found");
        }
    } catch (error) {
        next(error);
    }
}