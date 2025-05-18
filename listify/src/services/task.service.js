import validator from 'validator';
import { CustomError } from '../errors/customError.js';
import { fileDetailsRead } from "../utils/fileRead.js";
import { fileDetailsWrite } from "../utils/fileWrite.js";
import generateUniqueID from '../utils/generateID.js';

const createTimeStampedList = (taskComments) => {
    return taskComments.map((task) => ({ comment: task, timeStamp: new Date().toISOString() }));
}

export const createNewTask = async (userId, taskData) => {
    const taskId = generateUniqueID();
    let { taskComments } = taskData;
    if (taskComments) {
        taskComments = createTimeStampedList(taskComments);
    }
    const newTask = {
        taskId,
        ...taskData,
        ...(taskComments && { taskComments }),
        createdBy: userId
    };
    await fileDetailsWrite('tasks', newTask);
    return newTask;
}

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

export const sliceTasks = (taskList, page, limit) => {
    const currentPage = parseInt(page) <= 0 ? 1 : parseInt(page);  
    const specifiedLimit = parseInt(limit) <= 0 ? 5 : parseInt(limit);
    const startIndex = (currentPage - 1) * specifiedLimit; // retrieving the startingIndex
    const offset = startIndex + specifiedLimit;
    const remainingTasks = offset >= taskList.length ? 0 : taskList.length - offset;
    const paginatedTasks = taskList.slice(startIndex, offset);
    return ({
        tasks: paginatedTasks,
        tasksLeft: remainingTasks
    });
}

export const sortTasks = (taskList, orderBy, order) => {
    if (orderBy) {
        taskList.sort((firstTask, secondTask) => {
            const valueA = firstTask[orderBy];
            const valueB = secondTask[orderBy];
            if (typeof valueA === 'string') {
                return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                return order === 'asc' ? valueA - valueB : valueB - valueA;
            }
        });
    }
    return taskList;
}

export const fetchUserTasks = async (userId) => {
    const taskList = await fileDetailsRead('tasks');
    const userTaskList = taskList.filter((task) => task.createdBy === userId);
    return userTaskList;
} 

export const fetchTaskDetails = async (taskId) => {
    const taskList = await fileDetailsRead('tasks');
    const taskData = taskList.find((task) => task.taskId === taskId);
    return taskData;
}

export const updateTaskDetails = async (taskId, taskData) => {
    const taskList = await fileDetailsRead('tasks');
    const taskIndex = taskList.findIndex((task) => task.taskId === taskId);
    let { taskComments: newTaskComments, ...remainingDetails } = taskData;
    let taskComments = null;
    if (newTaskComments) {
        newTaskComments = createTimeStampedList(newTaskComments);
        taskComments = taskList[taskIndex].taskComments || [];
        newTaskComments.forEach((task) => taskComments.push(task));
    }
    taskList[taskIndex] = {
        ...taskList[taskIndex],
        ...(taskComments && { taskComments }),
        ...remainingDetails
    };
    await fileDetailsWrite('tasks', taskList, true);
}

export const removeTask = async (taskId) => {
    const taskList = await fileDetailsRead('tasks');
    const taskIndex = taskList.findIndex((task) => task.taskId === taskId);
    taskList.splice(taskIndex, 1);
    await fileDetailsWrite('tasks', taskList, true);
}