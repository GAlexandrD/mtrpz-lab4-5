import { join } from 'path';
import { DB } from '../../datastore/db';
import { existsSync, rmSync } from 'fs';

const dbPath = join(__dirname, 'testdir');
const db = new DB(dbPath);

describe('db tests', () => {
  it('db open', async () => {
    await db.open();
    const isExists = existsSync(join(dbPath, 'index'));
    expect(isExists).toBe(true);
  });

  const item: any = { field1: 'test1', field2: 'test2' };
  it('put item', async () => {
    await db.write('item', item);
    const foundItem = await db.readOne('item', { field1: 'test1' });
    expect(foundItem.field1).toBe('test1');
    expect(foundItem.field2).toBe('test2');
  });

  it('get item', async () => {
    const foundItem = await db.readOne('item', { field1: 'test1' });
    expect(foundItem.field1).toBe('test1');
    expect(foundItem.field2).toBe('test2');
  });

  it('remove item', async () => {
    await db.removeOne('item', { field1: 'test1' });
    const found = await db.readOne('item', { field1: 'test1' });
    expect(found).toBe(null);
  });

  const items: any[] = [
    { field1: 'hello', field2: 'smth' },
    { field1: 'hello1', field2: 'smth1' },
    { field1: 'hello2', field2: 'smth2' },
    { field1: 'hello3', field2: 'smth3' },
  ];

  it('put many', async () => {
    for (const item of items) {
      await db.write('item', item);
    }
    const item = await db.readOne('item', { field1: 'hello' });
    const item1 = await db.readOne('item', { field1: 'hello1' });
    const item2 = await db.readOne('item', { field1: 'hello2' });
    const item3 = await db.readOne('item', { field1: 'hello3' });
    expect(item).toEqual(items[0]);
    expect(item1).toEqual(items[1]);
    expect(item2).toEqual(items[2]);
    expect(item3).toEqual(items[3]);
  });

  it('readall', async () => {
    const foundItems = await db.readAll('item');
    if (!foundItems) fail('no items found');
    expect(foundItems.length).toBe(items.length);
    for (const item of foundItems) {
      const founded = items.find((i) => {
        const isEqualF1 = item.field1 === i.field1;
        const idEqualF2 = item.field2 === i.field2;
        if (isEqualF1 && idEqualF2) return true;
        return false;
      });
      expect(founded).not.toBe(null);
    }
  });

  afterAll(() => {
    rmSync(dbPath, { recursive: true, force: true });
  });
});
