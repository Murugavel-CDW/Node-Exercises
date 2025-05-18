import {
    createNewTask, fetchTaskDetails, fetchUserTasks, filterTasks, removeTask, sliceTasks, sortTasks, updateTaskDetails
} from "../services/task.service.js";

export const createTask = async (request, response, next) => {
    try {
        const userId = request.userId;
        const createdTask = await createNewTask(userId, request.body);
        response.status(201).json({
            message: "Task created successfully",
            taskId: createdTask.taskId
        });
    } catch (error) {
        next(error);
    }
}

export const fetchTasks = async (request, response, next) => {
    try {
        const { sortBy, order = 'asc', page = 1, limit = 5, ...filterCriteria} = request.query;
        const userId = request.userId;

        let userCreatedTasks = await fetchUserTasks(userId);
        userCreatedTasks = filterTasks(userCreatedTasks, filterCriteria);
        userCreatedTasks = sortTasks(userCreatedTasks, sortBy, order);
        const { tasks, tasksLeft } = sliceTasks(userCreatedTasks, page, limit);

        if (tasks.length > 0) {
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

export const fetchTask = async (request, response, next) => {
    try {
        const userId = request.userId;
        const { taskId } = request.params; 
        const taskDetails = await fetchTaskDetails(taskId);
        if (taskDetails) {
            if (taskDetails.createdBy === userId) {
                const { taskId, createdBy, ...taskData } = taskDetails;
                response.status(200).send(taskData);
            } else {
                response.status(403).send("Access to view this task is denied")
            }
        } else {
            response.status(404).send("Task could not be found");
        }
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (request, response, next) => {
    try {
        if (!request.body) {
            return response.status(400).send("Provide necessary fields to update");
        }
        const userId = request.userId;
        const { taskId } = request.params; 
        const taskDetails = await fetchTaskDetails(taskId);
        if (taskDetails) {
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