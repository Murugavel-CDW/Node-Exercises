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