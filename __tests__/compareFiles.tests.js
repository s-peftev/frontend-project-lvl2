import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { compareFiles } from '../src/gendiff-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('compareFiles', () => {
  const actual = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  expect(compareFiles(filepath1, filepath2)).toEqual(actual);
});

test('compareFiles - wrong filepath', () => {
  const filepath1 = getFixturePath('undefined1');
  const filepath2 = getFixturePath('undefined2');
  expect(() => compareFiles(filepath1, filepath2)).toThrow();
});
