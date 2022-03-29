import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { readFileSync } from 'fs';
import compareFiles from '../src/gendiff-index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const actualStylish = readFileSync(getFixturePath('result_stylish.txt'), 'utf-8');

const actualPlain = readFileSync(getFixturePath('result_plain.txt'), 'utf-8');

const actualJson = ['[{"propertyName":"common.follow","diffType":"added", "value":false}',
  '{"propertyName":"common.setting2","diffType":"deleted", "value":""}',
  '{"propertyName":"common.setting3","diffType":"updated", "value":{"fromValue":true,"toValue":null}}',
  '{"propertyName":"common.setting4","diffType":"added", "value":"blah blah"}',
  '{"propertyName":"common.setting5","diffType":"added", "value":"[complex value]"}',
  '{"propertyName":"common.setting6.doge","diffType":"updated", "value":{"fromValue":false,"toValue":"[complex value]"}}',
  '{"propertyName":"common.setting6.ops","diffType":"added", "value":"vops"}',
  '{"propertyName":"group1.baz","diffType":"updated", "value":{"fromValue":"bas","toValue":"bars"}}',
  '{"propertyName":"group1.nest","diffType":"updated", "value":{"fromValue":"[complex value]","toValue":"str"}}',
  '{"propertyName":"group2","diffType":"deleted", "value":""}',
  '{"propertyName":"group3","diffType":"added", "value":"[complex value]"}]'].join(',');

test('compareFiles - test .json stylish format', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualStylish);
});

test('compareFiles - test .yaml stylish format', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.yml');
  expect(compareFiles(filepath1, filepath2)).toEqual(actualStylish);
});

test('compareFiles - test .json plain format', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');
  expect(compareFiles(filepath1, filepath2, 'plain')).toEqual(actualPlain);
});

test('compareFiles - test .yaml plain format', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.yml');
  expect(compareFiles(filepath1, filepath2, 'plain')).toEqual(actualPlain);
});

test('compareFiles - test .json json format', () => {
  const filepath1 = getFixturePath('jsonFile1.json');
  const filepath2 = getFixturePath('jsonFile2.json');
  expect(compareFiles(filepath1, filepath2, 'json')).toEqual(actualJson);
});

test('compareFiles - test .yaml json format', () => {
  const filepath1 = getFixturePath('yamlFile1.yml');
  const filepath2 = getFixturePath('yamlFile2.yml');
  expect(compareFiles(filepath1, filepath2, 'json')).toEqual(actualJson);
});

test('compareFiles - wrong filepath', () => {
  const filepath1 = getFixturePath('undefined1');
  const filepath2 = getFixturePath('undefined2');
  expect(() => compareFiles(filepath1, filepath2)).toThrow();
});

test('compareFiles - wrong format name', () => {
  const filepath1 = getFixturePath('yamlFile1.yml');
  const filepath2 = getFixturePath('yamlFile2.yml');
  expect(() => compareFiles(filepath1, filepath2, 'undefined format')).toThrow();
});
