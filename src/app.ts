import { TaskController } from './controllers/task.controller';
import { ParserService } from './services/parser.service';

export class App {
  constructor(
    private readonly taskController: TaskController,
    private readonly parserService: ParserService,
  ) {}

  run() {
    try {
      const command = process.argv[2];
      const args = this.parserService.parse(process.argv);

      this.routeCommandToController(command, args);
    } catch (error: any) {
      console.log(error.message);
      process.exit(1);
    }
  }

  private routeCommandToController(command: string, args) {
    switch (command) {
      case 'create':
        this.taskController.create(args);
        break;
      case 'show-all':
        this.taskController.showAll();
        break;
      case 'show-undone':
        this.taskController.showUndoneList();
        break;
      case 'show-omited':
        this.taskController.showOmitedList();
        break;
      case 'edit':
        this.taskController.editTask(args);
        break;
      case 'markdone':
        this.taskController.markDone(args);
        break;
      case 'remove':
        this.taskController.removeTask(args);
        break;
      default:
        console.log('command didn`t foun');
    }
  }
}
