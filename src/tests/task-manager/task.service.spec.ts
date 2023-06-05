import { TaskServiceMock } from './../__mocks__/task.service.mock';
import { ITask, ITaskP } from './../../types/ITask';
import { TaskService } from '../../services/task.service';

let taskService: ReturnType<typeof TaskServiceMock>;

describe('task manager service', () => {
  const task: ITask = { name: 'mock', deadline: '', description: '', done: '' };

  beforeEach(() => {
    taskService = TaskServiceMock();
  });

  it('create task', async () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    taskService.markDone.mockReturnValue({ task, done: 'date' });
    await taskManager.markDone(task.name);
    expect(taskService.markDone.mock.calls[0][0]).toBe(task.name);
  });

  const editData: ITaskP = { description: 'info1' };

  it('edit task', async () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    taskService.editTask.mockReturnValue({ ...task });
    await taskManager.editTask('mock', editData);
    expect(taskService.editTask.mock.calls[0][0]).toBe(task.name);
    expect(taskService.editTask.mock.calls[0][1]).toEqual(editData);
  });

  it('markdone task', async () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    taskService.markDone.mockReturnValue({ ...task, done: 'date' });
    await taskManager.markDone(task.name);
    expect(taskService.markDone.mock.calls[0][0]).toBe(task.name);
  });

  it('remove task', async () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    taskService.removeTask.mockReturnValue(task);
    await taskManager.removeTask(task.name);
    expect(taskService.removeTask.mock.calls[0][0]).toBe(task.name);
  });

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

  it('get lists tests', async () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    taskService.getAllTasks.mockReturnValue(tasks);
    await taskManager.getAllTasks();
    expect(taskService.getAllTasks.mock.calls.length).toBe(1);

    taskService.getAllTasks.mockReturnValue(tasks);
    await taskManager.getOmited();
    expect(taskService.getAllTasks.mock.calls.length).toBe(2);

    taskService.getAllTasks.mockReturnValue(tasks);
    await taskManager.getUndone();
    expect(taskService.getAllTasks.mock.calls.length).toBe(3);
  });

  it('sort by deadline', () => {
    // @ts-ignore
    const taskManager = new TaskService(taskService);
    const result = taskManager.sortByDeadLine(tasks);
    expect(result[0].name).toBe('test1');
    expect(result[1].name).toBe('test2');
    expect(result[2].name).toBe('test3');
    expect(result[3].name).toBe('test4');
  });
});
