import { DBMockGenerator } from './../__mocks__/db.mock';
import { TaskService } from './../../datastore/task.service';
import { ITask } from './../../types/ITask';

let DB: ReturnType<typeof DBMockGenerator>;
DB = DBMockGenerator();

describe('task service tests', () => {
  const newTask: ITask = {
    name: 'test',
    deadline: '',
    description: '',
    done: '',
  };
  //@ts-ignore
  const taskService = new TaskService(DB);

  it('create task', async () => {
    DB.readOne.mockReturnValue(null);
    DB.readAll.mockReturnValue(null);
    await taskService.createTask(newTask);
    expect(DB.write.mock.calls[0][1]).toBe(newTask);
  });

  it('find task', async () => {
    DB.readAll.mockReturnValue([newTask]);
    DB.readOne.mockReturnValue(newTask);
    await taskService.findTask(newTask.name);
    expect(DB.readOne.mock.calls[0][1].name).toBe(newTask.name);
  });

  it('edit task', async () => {
    DB.write.mockReset()
    await taskService.editTask(newTask.name, { deadline: '2000-05-05' });
    expect(DB.removeOne.mock.calls[0][1].name).toBe(newTask.name);
    expect(DB.write.mock.calls.length).toBe(1)
  });

  it('get all tasks', async () => {
    DB.readAll.mockReturnValue([newTask]);
    DB.readOne.mockReturnValue(newTask);
    DB.readAll.mockReset();
    //@ts-ignore
    await taskService.getAllTasks();
    expect(DB.readAll.mock.calls.length).toBe(1);
  });

  it('remove task', async () => {
    DB.removeOne.mockReturnValue(newTask);
    //@ts-ignore
    await taskService.removeTask(newTask.name);
    expect(DB.removeOne.mock.calls[0][1].name).toBe(newTask.name);
  });
});
