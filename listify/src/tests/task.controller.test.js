// controllers/task.controller.test.js
import { jest, describe, test, expect, afterEach, beforeEach } from "@jest/globals";

// Create a fake in-memory store for tasks.
let fakeTaskStore = [
  {
    taskId: "task123",
    title: "Task1",
    description: "Details of task 1",
    createdBy: "user123",
  },
  {
    taskId: "task124",
    title: "Task2",
    description: "Details of task 2",
    createdBy: "user123",
  },
  {
    taskId: "task125",
    title: "Task3",
    description: "Details of task 3",
    createdBy: "user123",
  }
];

// Mocking the module
jest.unstable_mockModule("../utils/fileOperations.js", () => {
  return {
    fileDetailsRead: jest.fn(async (fileName) => {
      if (fileName === "tasks") {
        return fakeTaskStore;
      }
      return [];
    }),
    fileDetailsWrite: jest.fn(async (fileName, data, shouldReplace = false) => {
      if (fileName === "tasks") {
        if (shouldReplace) {
          // Replace the entire store
          fakeTaskStore = data;
        } else {
          fakeTaskStore.push(data);
        }
      }
      return;
    })
  };
});

const { fileDetailsRead, fileDetailsWrite } = await import(
  "../utils/fileOperations.js"
);

describe("Task controller integration", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask Controller", () => {
    const mockRequest = {
      userId: "user123",
      body: {
        title: "Test Task",
        taskComments: ["First Comment"],
      }
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    const mockNext = jest.fn();

    test("should create task and return success response", async () => {
      const { createTask } = await import("../controllers/task.controller.js");

      await createTask(mockRequest, mockResponse, mockNext);

      // Verify that the fake store now contains the new task.
      expect(fakeTaskStore[fakeTaskStore.length - 1]).toEqual(
        expect.objectContaining({
          title: "Test Task",
          createdBy: "user123",
        })
      );

      // Verify controller response
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Task created successfully",
        taskId: expect.any(String),
      });
    });

    test("should call next() with error when service fails", async () => {
      const error = new Error("File write failed");
      fileDetailsWrite.mockRejectedValueOnce(error);

      const { createTask } = await import("../controllers/task.controller.js");

      await createTask(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("fetchTasks Controller", () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockRequest = { query: {}, userId: "user123" };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn()
      };
      mockNext = jest.fn();
    });

    test("should return tasks and tasksLeft when tasks exist", async () => {
      const tasksArray = fakeTaskStore;
      mockRequest.query = { page: "1", limit: "2" };

      const { fetchTasks } = await import("../controllers/task.controller.js");

      await fetchTasks(mockRequest, mockResponse, mockNext);

      const expectedPaginatedTasks = tasksArray.slice(0, 2);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: expectedPaginatedTasks,
        tasksLeft: tasksArray.length - expectedPaginatedTasks.length,
      });
    });

    test("should display no tasks to display when no tasks are present", async () => {
      fakeTaskStore = [];

      const { fetchTasks } = await import("../controllers/task.controller.js");
      await fetchTasks(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith("No tasks to display");
    });

    test("should display no tasks when no filter criteria is satisfied", async () => {
      fakeTaskStore = [
        {
          taskId: "task123",
          title: "Task1",
          description: "Details of task 1",
          createdBy: "user123",
        },
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        },
      ];
      mockRequest.query = {
        title: "Random",
      };

      const { fetchTasks } = await import("../controllers/task.controller.js");

      await fetchTasks(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith("No tasks to display");
    });

    test("should call next() when service fails", async () => {
      const error = new Error("File Read Failed");
      fileDetailsRead.mockRejectedValueOnce(error);

      const { fetchTasks } = await import("../controllers/task.controller.js");

      await fetchTasks(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("Fetch task controller", () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockRequest = {
        userId: "user123",
        params: {
          taskId: "task123",
        },
      };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      mockNext = jest.fn();
    });

    test("should fetch the relevant task", async () => {
      const { fetchTask } = await import("../controllers/task.controller.js");

      await fetchTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith({
        title: "Task1",
        description: "Details of task 1",
      });
    });

    test("should display task could not be found on no matching tasks", async () => {
      fakeTaskStore = [
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        },
      ];

      const { fetchTask } = await import("../controllers/task.controller.js");

      await fetchTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith("Task could not be found");
    });

    test("should display access denied when the task is tried to be accessed by another user", async () => {
      mockRequest.userId = "user124";

      fakeTaskStore = [
        {
          taskId: "task123",
          title: "Task1",
          description: "Details of task 1",
          createdBy: "user123",
        },
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        },
      ];

      const { fetchTask } = await import("../controllers/task.controller.js");
      await fetchTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Access to view this task is denied"
      );
    });

    test("should call next() when service fails", async () => {
      const error = new Error("File Read Failed");
      fileDetailsRead.mockRejectedValueOnce(error);

      const { fetchTask } = await import("../controllers/task.controller.js");

      await fetchTask(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("Update task controller", () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockRequest = {
        userId: "user123",
        params: {
          taskId: "task123",
        },
        body: {
          title: "New title",
        },
      };

      mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockNext = jest.fn();
    });

    test("should update the task", async () => {
      const { updateTask } = await import("../controllers/task.controller.js");
      await updateTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Task updated successfully"
      );
    });

    test("should display task could not be found on no matching tasks", async () => {
      fakeTaskStore = [
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        },
      ];

      const { updateTask } = await import("../controllers/task.controller.js");
      await updateTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith("Task could not be found");
    });

    test('should display access denied when trying to be deleted by other user', async () => {
      fakeTaskStore = [
        {
          taskId: "task123",
          title: "Task1",
          description: "Details of task 1",
          createdBy: "user123",
        },
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        }
      ];
      mockRequest.userId = 'user124';

      const { updateTask } = await import('../controllers/task.controller.js');
      await updateTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith("Access to update this task is denied");
    });

    test("should call next() when service fails", async () => {
      const error = new Error("File Write Failed");
      
      fileDetailsRead.mockResolvedValueOnce(fakeTaskStore);
      fileDetailsWrite.mockRejectedValueOnce(error);

      const { updateTask } = await import("../controllers/task.controller.js");
      await updateTask(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("Delete task controller", () => {
    let mockRequest, mockResponse, mockNext;
    beforeEach(() => {
      mockRequest = {
        userId: "user123",
        params: {
          taskId: "task123",
        },
      };

      mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      mockNext = jest.fn();
    });

    test("should delete the task", async () => {
      const { deleteTask } = await import("../controllers/task.controller.js");
      await deleteTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(
        "Task deleted successfully"
      );
    });

    test("should display task could not be found on no matching tasks", async () => {
      fakeTaskStore = [
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        },
      ];

      const { deleteTask } = await import("../controllers/task.controller.js");
      await deleteTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith("Task could not be found");
    });

    test('should display access denied when trying to be deleted by other user', async () => {
      fakeTaskStore = [
        {
          taskId: "task123",
          title: "Task1",
          description: "Details of task 1",
          createdBy: "user123",
        },
        {
          taskId: "task124",
          title: "Task2",
          description: "Details of task 2",
          createdBy: "user123",
        },
        {
          taskId: "task125",
          title: "Task3",
          description: "Details of task 3",
          createdBy: "user123",
        }
      ];
      mockRequest.userId = 'user124';

      const { deleteTask } = await import('../controllers/task.controller.js');
      await deleteTask(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith("Access to delete this task is denied");
    });

    test("should call next() when service fails", async () => {
      const error = new Error("File Write Failed");

      fileDetailsRead.mockResolvedValueOnce(fakeTaskStore);
      fileDetailsWrite.mockRejectedValueOnce(error);

      const { deleteTask } = await import("../controllers/task.controller.js");
      await deleteTask(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
