import {
  access,
  appendFile,
  mkdir,
  readFile,
  unlink,
  writeFile,
} from 'fs/promises';
import { join } from 'path';
import { DbErrorMessages } from '../enums/errors/db-errors-enum';

interface Index {
  [key: string]: string[];
}

export class DB {
  private index: Index | null = null;
  private path: string;
  constructor(path: string) {
    this.path = path;
  }

  async open() {
    const indexPath = join(this.path, 'index');
    await mkdir(this.path, { recursive: true });
    try {
      await access(indexPath);
    } catch (error) {
      await appendFile(indexPath, JSON.stringify({}));
    }
    this.index = await this.getIndex();
  }

  async write(model: string, obj: any) {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    if (!this.index[model]) this.index[model] = [];
    const fileName = Math.random().toString(16).slice(2);
    const filePath = join(this.path, model, fileName);
    const jsonString = JSON.stringify(obj);
    const fileDir = join(this.path, model);
    await mkdir(fileDir, { recursive: true });
    await appendFile(filePath, jsonString);
    await this.addIndex(model, fileName);
  }

  async readOne(model: string, where: any): Promise<any | null> {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    for (const id of this.index[model]) {
      const obj = await this.readFile(join(this.path, model, id));
      if (!where) return obj;
      let isValid = true;
      for (const key of Object.keys(where)) {
        if (where[key] !== obj[key]) isValid = false;
      }
      if (isValid) return obj;
    }
    return null;
  }

  async removeOne(model: string, where: any): Promise<any | null> {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    let res: any = null;
    for (const id of this.index[model]) {
      const filePath = join(this.path, model, id);
      const obj = await this.readFile(filePath);
      if (!where) {
        res = obj;
        await unlink(filePath);
        await this.removeIndex(model, id);
        break;
      }
      let isValid = true;
      for (const key of Object.keys(where)) {
        if (where[key] !== obj[key]) isValid = false;
      }
      if (isValid) {
        res = obj;
        await unlink(filePath);
        await this.removeIndex(model, id);
        break;
      }
    }
    return res;
  }

  async readAll(model: string): Promise<any[] | null> {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    const objs = [];
    for (const id of this.index[model]) {
      const obj = await this.readFile(join(this.path, model, id));
      objs.push(obj);
    }
    return objs;
  }

  private async readFile(path: string) {
    const buf = await readFile(path);
    const obj = JSON.parse(buf.toString());
    return obj;
  }

  private async getIndex(): Promise<Index> {
    const indexPath = join(this.path, 'index');
    const buf = await readFile(indexPath);
    const obj: Index = JSON.parse(buf.toString());
    return obj;
  }

  private async removeIndex(model: string, fileName: string) {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    if (!this.index[model])
      throw new Error(DbErrorMessages.ERROR_NO_SUCH_MODEL);
    if (!this.index[model].includes(fileName))
      throw new Error(DbErrorMessages.ERROR_NO_SUCH_RECORD);
    const indexPath = join(this.path, 'index');
    const newIndex = this.index[model].filter((r) => r !== fileName);
    this.index[model] = newIndex;
    const indexStr = JSON.stringify(this.index);
    await writeFile(indexPath, indexStr);
  }

  private async addIndex(model: string, fileName: string) {
    if (!this.index) throw new Error(DbErrorMessages.ERROR_NOT_OPENED);
    const indexPath = join(this.path, 'index');
    if (!this.index[model]) this.index[model] = [];
    this.index[model].push(fileName);
    const indexStr = JSON.stringify(this.index);
    await writeFile(indexPath, indexStr);
  }
}
