import { ITask, ITaskP } from '../types/ITask';
import { TaskService } from '../services/task.service';
import { TaskErrors } from '../enums/errors/task-errors.enum';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  async create(args: any) {
    try {
      if (!args['-n']) throw new Error(TaskErrors.specifyNameToCreateTask);
      const name = args['-n'];
      const done = '';
      let [description, deadline] = ['', ''];
      if (args['-i']) description = args['-i'];
      if (args['-d']) deadline = args['-d'];
      const task: ITask = { name, deadline, description, done };
      const res = await this.taskService.createTask(task);
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async showAll() {
    try {
      const res = await this.taskService.getAllTasks();
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async showUndoneList() {
    try {
      const res = await this.taskService.getUndone();
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async markDone(args: any) {
    try {
      if (!args['-n']) throw new Error(TaskErrors.specifyNameToCreateTask);
      const name = args['-n'];
      const res = await this.taskService.markDone(name);
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async editTask(args: any) {
    try {
      if (!args['-n']) throw new Error(TaskErrors.specifyNameToCreateTask);
      const name = args['-n'];
      const edit: ITaskP = {};
      if (args['-i']) edit.description = args['-i'];
      if (args['-d']) edit.deadline = args['-d'];
      if (args['-e']) edit.name = args['-e'];
      const res = await this.taskService.editTask(name, edit);
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async showOmitedList() {
    try {
      const res = await this.taskService.getOmited();
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async removeTask(args: any) {
    try {
      if (!args['-n']) throw new Error(TaskErrors.specifyNameToCreateTask);
      const name = args['-n'];
      const res = await this.taskService.removeTask(name);
      console.log(res);
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
