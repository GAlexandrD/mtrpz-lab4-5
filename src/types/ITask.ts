export interface ITask {
  name: string;
  description: string;
  deadline: string;
  done: string;
}

export type ITaskP = Partial<Omit<ITask, 'done'>>;
