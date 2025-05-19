import validator from 'validator';

// Middleware to validate the task
const taskValidator = (request, response, next) => {
    const priorityNumArr = [1, 2, 3];
    const { title, description, priority, dueDate} = request.body || {}; // fallback empty object when the body is undefined

    if (request.method === 'POST' && (!title || !description)) {
        return response.status(400).send("Title and Description fields needs to be filled");
    }

    if (priority && !(priorityNumArr.includes(parseInt(priority)))) {
        return response.status(400).send("The value of priority should be within 1 to 3");
    }

    if (dueDate && !validator.isDate(dueDate)) {
        return response.status(400).send("Due date is invalid. Enter date in format (YYYY-MM-DD)");
    }

    if (dueDate && validator.isBefore(validator.toDate(dueDate).toISOString(), new Date().toISOString())) {
        return response.status(400).send("Due date cannot be before the current date");
    }

    next();
}

export default taskValidator;