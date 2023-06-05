import { ITask, ITaskP } from 'src/types/ITask';
import { DB } from '../db';

const ERROR_NOT_FOUND = 'task with such name doesn`t exists';
const ERROR_EXISTS = 'task with such name already exists';

export class TaskRepository {
  private db: DB;
  constructor(db: DB) {
    this.db = db;
  }
  private async checkTask(name: string) {
    const tasks = await this.db.readAll('tasks');
    if (!tasks) return false;
    for (const task of tasks) {
      if (task.name === name) return true;
    }
    return false;
  }

  async removeTask(name: string): Promise<ITask> {
    const task = await this.db.removeOne('tasks', { name });
    if (!task) throw new Error(ERROR_NOT_FOUND);
    return task;
  }

  async createTask(task: ITask): Promise<ITask> {
    const isExists = await this.checkTask(task.name);
    if (isExists) throw new Error(ERROR_EXISTS);
    if (task.deadline) {
      task.deadline = new Date(task.deadline).toISOString();
    }
    await this.db.write('tasks', task);
    return task;
  }

  async editTask(name: string, edit: ITaskP): Promise<ITask> {
    const isExists = await this.checkTask(name);
    if (!isExists) throw new Error(ERROR_NOT_FOUND);
    if (edit.deadline) {
      edit.deadline = new Date(edit.deadline).toISOString();
    }
    const prev = await this.db.removeOne('tasks', { name });
    const newTask: ITask = { ...prev, ...edit };
    await this.db.write('tasks', newTask);
    return newTask;
  }

  async markDone(name: string): Promise<ITask> {
    const isExists = await this.checkTask(name);
    if (!isExists) throw new Error(ERROR_NOT_FOUND);
    const prev = await this.db.removeOne('tasks', { name });
    const newTask: ITask = { ...prev, done: new Date().toISOString() };
    await this.db.write('tasks', newTask);
    return newTask;
  }

  async findTask(name: string): Promise<ITask | null> {
    const task = await this.db.readOne('tasks', { name: name });
    if (!task || task.name !== name) return null;
    return task;
  }

  async getAllTasks(): Promise<ITask[]> {
    const tasks = await this.db.readAll('tasks');
    if (!tasks) return [];
    return tasks;
  }
}
