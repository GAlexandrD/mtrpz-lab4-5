import { join } from 'path';
import { DB } from '../../datastore/db';
import { existsSync, rmSync } from 'fs';

const dbPath = join(__dirname, 'testdir');
const db = new DB(dbPath);

test('db open', async () => {
  await db.open();
  const isExists = existsSync(join(dbPath, 'index'));
  expect(isExists).toBe(true);
});

test('put/get item', async () => {
  const item: any = { field1: 'test1', field2: 'test2' };
  await db.write('item', item);
  const foundItem = await db.readOne('item', { field1: 'test1' });
  expect(foundItem.field1).toBe('test1');
  expect(foundItem.field2).toBe('test2');
});

test('remove item', async () => {
  await db.removeOne('item', { field1: 'test1' });
  const found = await db.readOne('item', { field1: 'test1' });
  expect(found).toBe(null);
});

test('put many/fundall', async () => {
  const items: any[] = [
    { field1: 'hello', field2: 'smth' },
    { field1: 'hello1', field2: 'smth1' },
    { field1: 'hello2', field2: 'smth2' },
    { field1: 'hello3', field2: 'smth3' },
  ];
  for (const item of items) {
    await db.write('item', item);
  }
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
