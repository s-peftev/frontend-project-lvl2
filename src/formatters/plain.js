import _ from 'lodash';

const deletedRender = (key, body, callback) => {

};

const addedRender = (key, body, callback) => {

};

const updatedRender = (key, body, callback) => {

};
const TYPE_SIGN_MAP = {
  deleted: (key, body, callback) => deletedRender(key, body, callback),
  added: (key, body, callback) => addedRender(key, body, callback),
  changed: (key, body, callback) => updatedRender(key, body, callback),
};

const plainFormarter = (diff, parrent = '') => {
  const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    if (Object.hasOwn(body, 'type')) {

    }
  });
  /* const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    if (Object.hasOwn(body, 'value')) {
      const sign = TYPE_SIGN_MAP[body.type];
      const value = _.isObject(body.value)
        ? plainFormarter(body.value, TABcount + 1)
        : body.value;

      return `${indent}${sign} ${key}: ${value}`;
    }
    if (Object.hasOwn(body, 'fromValue')) {
      const deletedSign = TYPE_SIGN_MAP.deleted;
      const addedSign = TYPE_SIGN_MAP.added;
      const fromValue = _.isObject(body.fromValue)
        ? plainFormarter(body.fromValue, TABcount + 1)
        : body.fromValue;
      const toValue = _.isObject(body.toValue)
        ? plainFormarter(body.toValue, TABcount + 1)
        : body.toValue;

      return `${indent}${deletedSign} ${key}: ${fromValue}\n${indent}${addedSign} ${key}: ${toValue}`;
    }
    const value = _.isObject(body)
      ? plainFormarter(body, TABcount + 1)
      : body;
    return `${indent}  ${key}: ${value}`;
  });
  return `{\n${maped.join('\n')}\n${iterIndentBar.repeat(TABcount)}}`; */
  return sorted;
};

export default plainFormarter;
