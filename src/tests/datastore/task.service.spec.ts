import { DBMockGenerator } from './../__mocks__/db.mock';
import { TaskService } from './../../datastore/task.service';
import { ITask } from './../../types/ITask';

let DB: ReturnType<typeof DBMockGenerator>;
DB = DBMockGenerator();

test('test task service', async () => {
  const newTask: ITask = {
    name: 'test',
    deadline: '',
    description: '',
    done: '',
  };
  //@ts-ignore
  const taskService = new TaskService(DB)

  //@ts-ignore
  await taskService.createTask(newTask);
  expect(DB.write.mock.calls[0][1]).toBe(newTask);

  DB.readOne.mockReturnValue(newTask);
  DB.removeOne.mockReturnValue(newTask);
  DB.readAll.mockReturnValue([newTask]);

  //@ts-ignore
  await taskService.findTask(newTask.name);
  expect(DB.readOne.mock.calls[0][1].name).toBe(newTask.name);

  //@ts-ignore
  await taskService.editTask(newTask.name, { deadline: '2000-05-05' });
  expect(DB.removeOne.mock.calls[0][1].name).toBe(newTask.name);
  expect(DB.write.mock.calls[1][1]).toEqual({
    ...newTask,
    deadline: new Date('2000-05-05').toISOString(),
  });

  DB.readAll.mockReset()
  //@ts-ignore
  await taskService.getAllTasks();
  expect(DB.readAll.mock.calls.length).toBe(1);

  //@ts-ignore
  await taskService.removeTask(newTask.name);
  expect(DB.removeOne.mock.calls[0][1].name).toBe(newTask.name);
});
