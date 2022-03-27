import _ from 'lodash';
import getParsedData from './parsers.js';

const WASTED_MARK = '  -';
const ADDED_MARK = '  +';
const SAME_MARK = '   ';

const getDifference = (data1, data2, mark) => {
  const entries = Object.entries(data1);
  const diff = entries.filter(([key]) => !Object.hasOwn(data2, key));
  return diff.map((item) => {
    item.unshift(mark);
    return item;
  });
};

const getIntersection = (data1, data2) => {
  const entries = Object.entries(data1);
  const intersec = entries.filter(([key]) => Object.hasOwn(data2, key));
  const result = [];
  intersec.forEach(([key, value]) => {
    if (data2[key] === value) {
      result.push([SAME_MARK, key, value]);
    } else {
      result.push([WASTED_MARK, key, value]);
      result.push([ADDED_MARK, key, data2[key]]);
    }
  });

  return result;
};

const renderDiff = (diff) => {
  const sorted = _.sortBy(diff, ([, key]) => key);
  const maped = sorted.map(([mark, key, value]) => [mark, `${key}:`, value].join(' '));
  return ['{', ...maped, '}'].join('\n');
};

export default (file1, file2) => {
  const fileData1 = getParsedData(file1);
  const fileData2 = getParsedData(file2);

  const wastedData = getDifference(fileData1, fileData2, WASTED_MARK);
  const addedData = getDifference(fileData2, fileData1, ADDED_MARK);
  const intersectedData = getIntersection(fileData1, fileData2);
  const allDiff = [...wastedData, ...addedData, ...intersectedData];

  return renderDiff(allDiff);
};
