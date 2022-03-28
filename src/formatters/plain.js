import _ from 'lodash';

const complexValuePlaceholder = '[complex value]';

const isDeleted = (diffBody) => diffBody.type === 'deleted';
const isAdded = (diffBody) => diffBody.type === 'added';
const isUpdated = (diffBody) => diffBody.type === 'updated';
const getStyledValue = (value) => {
  if (typeof value === 'string' && value !== complexValuePlaceholder) {
    return `'${value}'`;
  }

  return value;
};

const plainFormarter = (diff, parrent = '') => {
  const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.flatMap(([key, body]) => {
    if (isDeleted(body)) {
      return `Property '${parrent}${key}' was removed`;
    }
    if (isAdded(body)) {
      const value = _.isObject(body.value)
        ? complexValuePlaceholder
        : body.value;

      return `Property '${parrent}${key}' was added with value: ${getStyledValue(
        value,
      )}`;
    }
    if (isUpdated(body)) {
      if (Object.hasOwn(body.value, 'fromValue')) {
        const changed = body.value;
        const fromValue = _.isObject(changed.fromValue)
          ? complexValuePlaceholder
          : changed.fromValue;
        const toValue = _.isObject(changed.toValue)
          ? complexValuePlaceholder
          : changed.toValue;

        return `Property '${parrent}${key}' was updated. From ${getStyledValue(
          fromValue,
        )} to ${getStyledValue(toValue)}`;
      }
      const newParrent = parrent === '' ? `${key}.` : `${parrent}${key}.`;
      return plainFormarter(body.value, newParrent);
    }
    return null;
  });

  return maped.filter((notNull) => notNull).join('\n');
};

export default plainFormarter;
