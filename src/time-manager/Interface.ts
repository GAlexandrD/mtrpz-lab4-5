import { DB } from '../datastore/db';
import { ITask, ITaskP } from '../types/ITask.js';
import { TaskService } from '../datastore/task.service.js';

export class Interface {
  db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  async createTask(task: ITask): Promise<string> {
    const newTask = await TaskService.createTask(this.db, task);
    return this.serializeTask(newTask);
  }

  sortByDeadLine(tasks: ITask[]): ITask[] {
    return tasks.sort((a, b) => {
      const isDoneA = a.done !== '' && b.done === ''
      const isDoneB = a.done === '' && b.done !== ''
      const noDeadLineA = a.deadline === '' && b.deadline !== ''
      const noDeadLineB = a.deadline !== '' && b.deadline === ''
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      const isFartherA = dateA.getTime() > dateB.getTime()
      if (isDoneA) return 1;
      if (isDoneB) return -1;
      if (noDeadLineA) return 1;
      if (noDeadLineB) return -1;
      if (isFartherA) return 1;
      return -1;
    });
  }

  async getUndone(): Promise<string> {
    const tasks = await TaskService.getAllTasks(this.db);
    const undone = tasks.filter((task) => {
      if (task.done == '') return task;
    });
    const sorted = this.sortByDeadLine(undone);
    return this.serializeList(sorted);
  }

  isOmited(task: ITask): boolean {
    if (!task.deadline) return false;
    if (task.done) return false;
    const deadline = new Date(task.deadline);
    const curdate = new Date();
    return this.compareDates(curdate, deadline);
  }

  compareDates(date1: Date, date2: Date): boolean {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    if (year1 !== year2) return year1 > year2;
    const month1 = date1.getMonth();
    const month2 = date2.getMonth();
    if (month1 !== month2) return month1 > month2;
    const day1 = date1.getDate();
    const day2 = date2.getDate();
    return day1 > day2;
  }

  async getOmited(): Promise<string> {
    const tasks = await TaskService.getAllTasks(this.db);
    const omited = tasks.filter((task) => {
      return this.isOmited(task);
    });
    const sorted = this.sortByDeadLine(omited);
    return this.serializeList(sorted);
  }

  async getAllTasks(): Promise<string> {
    const tasks = await TaskService.getAllTasks(this.db);
    const sorted = this.sortByDeadLine(tasks);
    return this.serializeList(sorted);
  }

  async markDone(name: string): Promise<string> {
    const task = await TaskService.markDone(this.db, name);
    return this.serializeTask(task);
  }

  async editTask(name: string, edit: ITaskP): Promise<string> {
    const task = await TaskService.editTask(this.db, name, edit);
    return this.serializeTask(task);
  }

  async removeTask(name: string): Promise<string> {
    const task = await TaskService.removeTask(this.db, name);
    return this.serializeTask(task);
  }

  private serializeTask(task: ITask): string {
    let res = '';
    res += `Task:${task.name}\n`;
    if (task.description) {
      res += `Description: ${task.description}\n`;
    }
    if (task.deadline) {
      res += `Deadline: ${task.deadline}\n`;
    }

    if (task.done) {
      const date = task.done.slice(0, 10);
      res += `State: done ${date}\n`;
    } else {
      res += `State: not done\n`;
    }
    return res;
  }

  private serializeList(tasks: ITask[]): string {
    let res = '';
    if (tasks.length === 0) {
      res += 'No tasks found';
    }
    for (const task of tasks) {
      res += this.serializeTask(task);
      res += '\n';
    }
    return res;
  }
}