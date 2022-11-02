const id = (v: unknown): unknown => v;
jest.mock('chalk', () => ({
  green: id,
  gray: id,
  red: id,
  blue: id,
}));

export {};
