import * as path from 'path';

import { DB } from './datastore/db';
import { TaskRepository } from './datastore/repositories/task.repository';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { ParserService } from './services/parser.service';

export const parserService = new ParserService();
export const db = new DB(path.join(__dirname, 'store'));
export const taskRepository = new TaskRepository(db);
export const taskService = new TaskService(taskRepository);
export const taskController = new TaskController(taskService);
