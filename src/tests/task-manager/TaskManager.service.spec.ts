import { TaskServiceMock } from './../__mocks__/task.service.mock';
import { ITask, ITaskP } from './../../types/ITask';
import { TaskManager } from './../../time-manager/TaskManager.service';

let taskService: ReturnType<typeof TaskServiceMock>;
taskService = TaskServiceMock();

test('test task manager service create/edit/remove', async () => {
  //@ts-ignore
  const taskManager = new TaskManager(taskService);

  const task: ITask = { name: 'mock', deadline: '', description: '', done: '' };
  const editData: ITaskP = { description: 'info1' };

  taskService.createTask.mockReturnValue(task);
  await taskManager.createTask(task);
  expect(taskService.createTask.mock.calls[0][0].name).toBe(task.name);

  taskService.editTask.mockReturnValue({ ...task });
  await taskManager.editTask('mock', editData);
  expect(taskService.editTask.mock.calls[0][0]).toBe(task.name);
  expect(taskService.editTask.mock.calls[0][1]).toEqual(editData);

  taskService.markDone.mockReturnValue({ task, done: 'date' });
  await taskManager.markDone(task.name);
  expect(taskService.markDone.mock.calls[0][0]).toBe(task.name);
});

test('test lists and sorting', () => {
  // @ts-ignore
  const taskManager = new TaskManager(taskService);
  const tasks: ITask[] = [
    {
      name: 'test3',
      deadline: new Date('2023-06-20').toISOString(),
      description: '',
      done: '',
    },
    {
      name: 'test1',
      deadline: new Date('2023-06-3').toISOString(),
      description: '',
      done: '',
    },
    {
      name: 'test2',
      deadline: new Date('2023-06-15').toISOString(),
      description: '',
      done: '',
    },
    {
      name: 'test4',
      deadline: '',
      description: '',
      done: '',
    },
  ];

  taskService.getAllTasks.mockReturnValue(tasks)
  taskManager.getAllTasks()
  expect(taskService.getAllTasks.mock.calls.length).toBe(1)

  taskManager.getOmited()
  expect(taskService.getAllTasks.mock.calls.length).toBe(2)

  taskManager.getUndone()
  expect(taskService.getAllTasks.mock.calls.length).toBe(3)

  const result = taskManager.sortByDeadLine(tasks);
  expect(result[0].name).toBe('test1');
  expect(result[1].name).toBe('test2');
  expect(result[2].name).toBe('test3');
  expect(result[3].name).toBe('test4');
});

