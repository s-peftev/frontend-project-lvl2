import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import compareFiles from '../src/gendiff-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const actualFlatFiles = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

const actualComplexFiles = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
          - doge: false
          + doge: {
                wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;

test('compareFlatFiles - test json', () => {
  const filepath1 = getFixturePath('flatJsonFile1.json');
  const filepath2 = getFixturePath('flatJsonFile2.json');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualFlatFiles);
});

test('compareComplexFiles - test json', () => {
  const filepath1 = getFixturePath('jsonFile1.json');
  const filepath2 = getFixturePath('jsonFile2.json');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualComplexFiles);
});

test('compareComplexFiles - test yaml', () => {
  const filepath1 = getFixturePath('yamlFile1.yml');
  const filepath2 = getFixturePath('yamlFile2.yml');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualComplexFiles);
});

test('compareFiles - wrong filepath', () => {
  const filepath1 = getFixturePath('undefined1');
  const filepath2 = getFixturePath('undefined2');
  expect(() => compareFiles(filepath1, filepath2)).toThrow();
});
