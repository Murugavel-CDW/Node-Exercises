import validator from 'validator';
import { CustomError } from '../errors/customError.js';
import { fileDetailsRead } from "../utils/fileRead.js";
import { fileDetailsWrite } from "../utils/fileWrite.js";
import generateUniqueID from '../utils/generateID.js';

// Function to create timestamps for each entry in the array
const createTimeStampedList = (taskComments) => {
    return taskComments.map((task) => ({ comment: task, timeStamp: new Date().toISOString() }));
}

// Function to create a new task
export const createNewTask = async (userId, taskData) => {
    const taskId = generateUniqueID(); // generating unique id for the task
    let { taskComments } = taskData;
    if (taskComments) { // if task comments is present in the body
        taskComments = createTimeStampedList(taskComments);
    }
    const newTask = {
        taskId,
        ...taskData,
        ...(taskComments && { taskComments }), // if task comments is present, copy the values
        createdBy: userId
    };
    await fileDetailsWrite('tasks', newTask); // writing the new task to the file
    return newTask;
}

// Function to filter the tasks based on the criteria
export const filterTasks = (taskList, filterCriteria) => {
    let filteredTasks = taskList;
    const { title, priority, dueDate } = filterCriteria;
    if (title) {
        filteredTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(title.toLowerCase()));
    }

    if (priority) {
        filteredTasks = filteredTasks.filter((task) => task.priority === parseInt(priority));
    }

    if (dueDate) {
        if (validator.isDate(dueDate)) {
            filteredTasks = filteredTasks.filter((task) => task.dueDate === dueDate);
        } else {
            throw new CustomError("Invalid date format received. Expected format (YYYY-MM-DD)", 400);
        }
    }

    return filteredTasks;
}

// Function to extract a part of the tasks list based on the limit
export const sliceTasks = (taskList, page, limit) => {
    const currentPage = parseInt(page) <= 0 ? 1 : parseInt(page); // creating a fallback when the given value is negative or 0
    const specifiedLimit = parseInt(limit) <= 0 ? 5 : parseInt(limit);
    const startIndex = (currentPage - 1) * specifiedLimit; // retrieving the startingIndex
    const offset = startIndex + specifiedLimit;
    const remainingTasks = offset >= taskList.length ? 0 : taskList.length - offset; // calculating the number of tasks that are left
    const paginatedTasks = taskList.slice(startIndex, offset);
    return ({
        tasks: paginatedTasks,
        tasksLeft: remainingTasks
    });
}

// Function to sort the tasks based on the field and sorting order
export const sortTasks = (taskList, orderBy, order) => {
    if (orderBy) {
        taskList.sort((firstTask, secondTask) => {
            const valueA = firstTask[orderBy];
            const valueB = secondTask[orderBy];
            if (typeof valueA === 'string') { // if the value is a string
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }
        });
    }
    return taskList;
}

// Function to fetch the list of tasks created by the user with userID
export const fetchUserTasks = async (userId) => {
    const taskList = await fileDetailsRead('tasks');
    const userTaskList = taskList.filter((task) => task.createdBy === userId);
    return userTaskList;
} 

// Function to fetch a specific task based on its task id
export const fetchTaskDetails = async (taskId) => {
    const taskList = await fileDetailsRead('tasks');
    const taskData = taskList.find((task) => task.taskId === taskId);
    return taskData;
}

// Function to update the details of a task with taskID with the task data
export const updateTaskDetails = async (taskId, taskData) => {
    const taskList = await fileDetailsRead('tasks');
    const taskIndex = taskList.findIndex((task) => task.taskId === taskId);
    let { taskComments: newTaskComments, ...remainingDetails } = taskData;
    let taskComments = null;
    if (newTaskComments) { // if task comments is included in the body
        newTaskComments = createTimeStampedList(newTaskComments);
        // creating a new array if it is the first time creating the task comments
        taskComments = taskList[taskIndex].taskComments || [];
        newTaskComments.forEach((task) => taskComments.push(task));
    }
    // Updating the task with the task data
    taskList[taskIndex] = {
        ...taskList[taskIndex],
        ...(taskComments && { taskComments }),
        ...remainingDetails
    };
    await fileDetailsWrite('tasks', taskList, true);
}

// Function to remove the task having task id
export const removeTask = async (taskId) => {
    const taskList = await fileDetailsRead('tasks');
    const taskIndex = taskList.findIndex((task) => task.taskId === taskId);
    taskList.splice(taskIndex, 1);
    await fileDetailsWrite('tasks', taskList, true);
}