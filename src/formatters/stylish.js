import _ from 'lodash';

const TYPE_SIGN_MAP = {
  deleted: '-',
  added: '+',
  same: ' ',
  changed: ' ',
};

const stylishFormarter = (diff, TABcount = 0) => {
  const defaultIndentBar = '  ';
  const iterIndentBar = '    ';
  const indent = [iterIndentBar.repeat(TABcount), defaultIndentBar].join('');

  const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    if (Object.hasOwn(body, 'value')) {
      const sign = TYPE_SIGN_MAP[body.type];
      const value = _.isObject(body.value)
        ? stylishFormarter(body.value, TABcount + 1)
        : body.value;

      return `${indent}${sign} ${key}: ${value}`;
    }
    if (Object.hasOwn(body, 'fromValue')) {
      const deletedSign = TYPE_SIGN_MAP.deleted;
      const addedSign = TYPE_SIGN_MAP.added;
      const fromValue = _.isObject(body.fromValue)
        ? stylishFormarter(body.fromValue, TABcount + 1)
        : body.fromValue;
      const toValue = _.isObject(body.toValue)
        ? stylishFormarter(body.toValue, TABcount + 1)
        : body.toValue;

      return `${indent}${deletedSign} ${key}: ${fromValue}\n${indent}${addedSign} ${key}: ${toValue}`;
    }
    const value = _.isObject(body)
      ? stylishFormarter(body, TABcount + 1)
      : body;
    return `${indent}  ${key}: ${value}`;
  });
  return `{\n${maped.join('\n')}\n${iterIndentBar.repeat(TABcount)}}`;
};

export default stylishFormarter;
