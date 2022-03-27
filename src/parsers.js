import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const getFileData = (filepath) => {
  try {
    const data = readFileSync(filepath, 'utf8');
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getParser = (fileExtension) => {
  const parserMap = {
    '.json': (data) => JSON.parse(data),
    '.yml': (data) => yaml.load(data),
  };

  return parserMap[fileExtension];
};

export default (filePath) => {
  const parser = getParser(path.extname(filePath));
  return parser(getFileData(filePath));
};
