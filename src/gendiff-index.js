import _ from 'lodash';
import getParsedData from './parsers.js';
import getFormarter from './formatters/index.js';

const getDifference = (data1, data2, type) => {
  const diff = {};
  const entriesData1 = Object.entries(data1);

  _.map(entriesData1, ([key, value]) => {
    if (!Object.hasOwn(data2, key)) {
      diff[key] = { type, value };
    }
  });

  return diff;
};

const getIntersection = (data1, data2, callback) => {
  const diff = {};
  const entriesData1 = Object.entries(data1);

  _.map(entriesData1, ([key, value]) => {
    if (Object.hasOwn(data2, key)) {
      if (!_.isObject(value) || !_.isObject(data2[key])) {
        diff[key] = value === data2[key]
          ? { type: 'same', value }
          : { type: 'changed', fromValue: value, toValue: data2[key] };
      }

      if (_.isObject(value) && _.isObject(data2[key])) {
        diff[key] = {
          type: 'changed',
          value: callback(value, data2[key]),
        };
      }
    }
  });

  return diff;
};

const getDiffReport = (data1, data2) => {
  const deleted = getDifference(data1, data2, 'deleted');
  const added = getDifference(data2, data1, 'added');
  const intersected = getIntersection(data1, data2, getDiffReport);

  return { ...deleted, ...added, ...intersected };
};

export default (file1, file2, formarterName = 'stylish') => {
  try {
    const fileData1 = getParsedData(file1);
    const fileData2 = getParsedData(file2);
    const diff = getDiffReport(fileData1, fileData2);
    const formarter = getFormarter(formarterName);

    return formarter(diff);
  } catch (e) {
    return e;
  }
};
