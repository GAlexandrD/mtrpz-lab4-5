export const TaskServiceMock = () => ({
  removeTask: jest.fn(),
  createTask: jest.fn(),
  editTask: jest.fn(),
  markDone: jest.fn(),
  findTask: jest.fn(),
  getAllTasks: jest.fn(),
});
