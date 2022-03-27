import _ from 'lodash';
import getParsedData from './parsers.js';

const stylishFormarter = (diff, TABcount = 0) => {
  const typeSignMap = {
    deleted: '-',
    added: '+',
    same: ' ',
    changed: ' ',
  };
  const defaultIndentBar = '  ';
  const iterIndentBar = '    ';
  const nextIndentCount = TABcount + 1;
  const indent = [iterIndentBar.repeat(TABcount), defaultIndentBar].join('');

  const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    if (Object.hasOwn(body, 'value')) {
      const sign = typeSignMap[body.type];
      const value = _.isObject(body.value)
        ? stylishFormarter(body.value, nextIndentCount)
        : body.value;

      return `${indent}${sign} ${key}: ${value}`;
    }
    if (Object.hasOwn(body, 'fromValue')) {
      const deletedSign = typeSignMap.deleted;
      const addedSign = typeSignMap.added;
      const fromValue = _.isObject(body.fromValue)
        ? stylishFormarter(body.fromValue, nextIndentCount)
        : body.fromValue;
      const toValue = _.isObject(body.toValue)
        ? stylishFormarter(body.toValue, nextIndentCount)
        : body.toValue;

      return `${indent}${deletedSign} ${key}: ${fromValue}\n${indent}${addedSign} ${key}: ${toValue}`;
    }
    const value = _.isObject(body)
      ? stylishFormarter(body, nextIndentCount)
      : body;
    return `${indent}  ${key}: ${value}`;
  });
  return `{\n${maped.join('\n')}\n${iterIndentBar.repeat(TABcount)}}`;
};

const getFormarter = (formarterName) => {
  const FORMARTER_MAP = {
    stylish: (data) => stylishFormarter(data),
  };

  return FORMARTER_MAP[formarterName];
};

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
  const fileData1 = getParsedData(file1);
  const fileData2 = getParsedData(file2);

  const diff = getDiffReport(fileData1, fileData2);

  const formarter = getFormarter(formarterName);

  return formarter(diff);
};
