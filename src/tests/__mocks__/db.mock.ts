export const DBMockGenerator = () => ({
  write: jest.fn(),
  readAll: jest.fn(),
  readOne: jest.fn(),
  removeOne: jest.fn(),
});
