import fs from 'fs/promises';
import path from 'path';

interface Index {
  [key: string]: string[];
}

const ERROR_NOT_OPENED = 'Db wasn`t opened';
const ERROR_NO_SUCH_MODEL = 'no such model';
const ERROR_NO_SUCH_RECORD = 'no such record';

export class DB {
  index: Index | null = null;
  path: string;
  constructor(path: string) {
    this.path = path;
  }

  async open() {
    const indexPath = path.join(this.path, 'index');
    await fs.mkdir(this.path, { recursive: true });
    try {
      await fs.access(indexPath);
    } catch (error) {
      await fs.appendFile(indexPath, JSON.stringify({}));
    }
    this.index = await this.getIndex();
  }

  async write(model: string, obj: any) {
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    if (!this.index[model]) this.index[model] = [];
    const fileName = Math.random().toString(16).slice(2);
    const filePath = path.join(this.path, model, fileName);
    const jsonString = JSON.stringify(obj);
    const fileDir = path.join(this.path, model);
    await fs.mkdir(fileDir, { recursive: true });
    await fs.appendFile(filePath, jsonString);
    await this.addIndex(model, fileName);
  }

  async readOne(model: string, where: any): Promise<any | null> {
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    for (const id of this.index[model]) {
      const obj = await this.readFile(path.join(this.path, model, id));
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
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    let res: any = null;
    for (const id of this.index[model]) {
      const filePath = path.join(this.path, model, id);
      const obj = await this.readFile(filePath);
      if (!where) {
        res = obj;
        await fs.unlink(filePath);
        await this.removeIndex(model, id);
        break;
      }
      let isValid = true;
      for (const key of Object.keys(where)) {
        if (where[key] !== obj[key]) isValid = false;
      }
      if (isValid) {
        res = obj;
        await fs.unlink(filePath);
        await this.removeIndex(model, id);
        break;
      }
    }
    return res;
  }

  async readAll(model: string): Promise<any[] | null> {
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    if (!this.index[model]) return null;
    const objs = [];
    for (const id of this.index[model]) {
      const obj = await this.readFile(path.join(this.path, model, id));
      objs.push(obj);
    }
    return objs;
  }

  private async readFile(path: string) {
    const buf = await fs.readFile(path);
    const obj = JSON.parse(buf.toString());
    return obj;
  }

  private async getIndex(): Promise<Index> {
    const indexPath = path.join(this.path, 'index');
    const buf = await fs.readFile(indexPath);
    const obj: Index = JSON.parse(buf.toString());
    return obj;
  }

  private async removeIndex(model: string, fileName: string) {
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    if (!this.index[model]) throw new Error(ERROR_NO_SUCH_MODEL);
    if (!this.index[model].includes(fileName))
      throw new Error(ERROR_NO_SUCH_RECORD);
    const indexPath = path.join(this.path, 'index');
    const newIndex = this.index[model].filter((r) => r !== fileName);
    this.index[model] = newIndex;
    const indexStr = JSON.stringify(this.index);
    await fs.writeFile(indexPath, indexStr);
  }

  private async addIndex(model: string, fileName: string) {
    if (!this.index) throw new Error(ERROR_NOT_OPENED);
    const indexPath = path.join(this.path, 'index');
    if (!this.index[model]) this.index[model] = [];
    this.index[model].push(fileName);
    const indexStr = JSON.stringify(this.index);
    await fs.writeFile(indexPath, indexStr);
  }
}
