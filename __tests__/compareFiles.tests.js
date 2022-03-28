import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import compareFiles from '../src/gendiff-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const actualStylish = `{
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

const actualPlain = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge' was updated. From false to [complex value]
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

test('compareFiles - test json stylish format', () => {
  const filepath1 = getFixturePath('jsonFile1.json');
  const filepath2 = getFixturePath('jsonFile2.json');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualStylish);
});

test('compareFiles - test yaml stylish format', () => {
  const filepath1 = getFixturePath('yamlFile1.yml');
  const filepath2 = getFixturePath('yamlFile2.yml');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualStylish);
});

test('compareFiles - test json plain format', () => {
  const filepath1 = getFixturePath('jsonFile1.json');
  const filepath2 = getFixturePath('jsonFile2.json');
  expect(compareFiles(filepath1, filepath2, 'plain')).toEqual(actualPlain);
});

test('compareFiles - test yaml plain format', () => {
  const filepath1 = getFixturePath('yamlFile1.yml');
  const filepath2 = getFixturePath('yamlFile2.yml');
  expect(compareFiles(filepath1, filepath2, 'plain')).toEqual(actualPlain);
});

test('compareFiles - wrong filepath', () => {
  const filepath1 = getFixturePath('undefined1');
  const filepath2 = getFixturePath('undefined2');
  expect(() => compareFiles(filepath1, filepath2)).toThrow();
});
