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
  const indentCount = TABcount;
  const nextIndentCount = TABcount + 1;
  const indent = [iterIndentBar.repeat(indentCount), defaultIndentBar].join('');
  const entries = Object.entries(diff);
  const sorted = _.sortBy(entries, ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    if (
      body.type === 'added'
      || body.type === 'deleted'
      || body.type === 'same'
    ) {
      return _.isObject(body.value)
        ? `${indent}${typeSignMap[body.type]} ${key}: ${stylishFormarter(
          body.value,
          nextIndentCount,
        )}`
        : `${indent}${typeSignMap[body.type]} ${key}: ${body.value}`;
    }
    if (body.type === 'changed') {
      if (_.isObject(body.children)) {
        return `${indent}${typeSignMap[body.type]} ${key}: ${stylishFormarter(
          body.children,
          nextIndentCount,
        )}`;
      }
      if (_.isObject(body.fromValue)) {
        return `${indent}${typeSignMap.deleted} ${key}: ${stylishFormarter(
          body.fromValue,
          nextIndentCount,
        )}\n${indent}${typeSignMap.added} ${key}: ${body.toValue}`;
      }
      if (_.isObject(body.toValue)) {
        return `${indent}${typeSignMap.deleted} ${key}: ${
          body.fromValue
        }\n${indent}${typeSignMap.added} ${key}: ${stylishFormarter(
          body.toValue,
          nextIndentCount,
        )}`;
      }
      return `${indent}${typeSignMap.deleted} ${key}: ${body.fromValue}\n${indent}${typeSignMap.added} ${key}: ${body.toValue}`;
    }
    if (_.isObject(body)) {
      return `${indent}  ${key}: ${stylishFormarter(body, nextIndentCount)}`;
    }

    return `${indent}  ${key}: ${body}`;
  });

  return `{\n${maped.join('\n')}\n${iterIndentBar.repeat(indentCount)}}`;
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
          children: callback(value, data2[key]),
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
