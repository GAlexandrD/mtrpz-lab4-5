import { DB } from './db.js';

export interface ITask {
  name: string;
  description: string;
  deadline: string;
  done: string;
}

export interface ITaskP {
  name?: string;
  description?: string;
  deadline?: string;
}

const ERROR_NOT_FOUND = 'task with such name doesn`t exists';
const ERROR_EXISTS = 'task with such name already exists';

export class TaskService {
  private static async checkTask(db: DB, name: string) {
    const tasks = await db.readAll('tasks');
    if (!tasks) return false;
    for (const task of tasks) {
      if (task.name === name) return true;
    }
    return false;
  }

  static async removeTask(db: DB, name: string): Promise<ITask> {
    const task = await db.removeOne('tasks', { name });
    if (!task) throw new Error(ERROR_NOT_FOUND);
    return task;
  }

  static async createTask(db: DB, task: ITask): Promise<ITask> {
    const isExists = await this.checkTask(db, task.name);
    if (isExists) throw new Error(ERROR_EXISTS);
    if (task.deadline) {
      task.deadline = new Date(task.deadline).toISOString();
    }
    await db.write('tasks', task);
    return task;
  }

  static async editTask(db: DB, name: string, edit: ITaskP): Promise<ITask> {
    const isExists = await this.checkTask(db, name);
    if (!isExists) throw new Error(ERROR_NOT_FOUND);
    if (edit.deadline) {
      edit.deadline = new Date(edit.deadline).toISOString();
    }
    const prev = await db.removeOne('tasks', { name });
    const newTask: ITask = { ...prev, ...edit };
    await db.write('tasks', newTask);
    return newTask;
  }

  static async markDone(db: DB, name: string): Promise<ITask> {
    const isExists = await this.checkTask(db, name);
    if (!isExists) throw new Error(ERROR_NOT_FOUND);
    const prev = await db.removeOne('tasks', { name });
    const newTask: ITask = { ...prev, done: new Date().toISOString() };
    await db.write('tasks', newTask);
    return newTask;
  }

  static async findTask(db: DB, name: string): Promise<ITask | null> {
    const task = await db.readOne('tasks', { name: name });
    if (!task || task.name !== name) return null;
    return task;
  }

  static async getAllTasks(db: DB): Promise<ITask[]> {
    const tasks = await db.readAll('tasks');
    if (!tasks) return [];
    return tasks;
  }
}
