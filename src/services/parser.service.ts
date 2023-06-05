export class ParserService {
  parse(args: string[]) {
    const parsed: any = {};
    for (const [i, arg] of args.entries()) {
      if (arg.slice(0, 1) === '-') {
        parsed[arg] = args[i + 1] || '';
      }
    }
    if (parsed['-d']) {
      const dateREG = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
      const date: string = parsed['-d'];
      if (!dateREG.test(date)) {
        throw new Error('wrong date format, should be YYYY-MM-DD');
      }
    }
    return parsed;
  }
}
