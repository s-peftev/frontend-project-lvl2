import _ from 'lodash';

const complexValuePlaceholder = '[complex value]';

const getStyledValue = (value) => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return value;
};

const renderDeleted = (body, parrent, key) => `{"propertyName":"${parrent}${key}","diffType":"${body.type}", "value":""}`;

const renderAdded = (body, parrent, key) => {
  const value = _.isObject(body.value) ? complexValuePlaceholder : body.value;

  return `{"propertyName":"${parrent}${key}","diffType":"${body.type}", "value":${getStyledValue(value)}}`;
};

const renderUpdated = (body, parrent, key, callback) => {
  if (_.has(body.value, 'fromValue')) {
    const changed = body.value;
    const fromValue = _.isObject(changed.fromValue)
      ? complexValuePlaceholder
      : changed.fromValue;
    const toValue = _.isObject(changed.toValue)
      ? complexValuePlaceholder
      : changed.toValue;

    return `{"propertyName":"${parrent}${key}","diffType":"${body.type}", "value":{"fromValue":${getStyledValue(fromValue)},"toValue":${getStyledValue(toValue)}}}`;
  }

  const newParrent = parrent === '' ? `${key}.` : `${parrent}${key}.`;
  return callback(body.value, newParrent);
};

const TYPE_RENDER_MAP = {
  deleted: (body, parrent, key) => renderDeleted(body, parrent, key),
  added: (body, parrent, key) => renderAdded(body, parrent, key),
  updated: (body, parrent, key, callback) => renderUpdated(body, parrent, key, callback),
  same: () => null,
  nestedComlex: () => null,
};

const jsonFormarter = (diffReport) => {
  const getFormattedString = (diff, parrent = '') => {
    const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
    const maped = sorted.flatMap(([key, body]) => {
      const resultRender = _.has(body, 'value')
        ? TYPE_RENDER_MAP[body.type]
        : TYPE_RENDER_MAP.nestedComlex;
      return resultRender(body, parrent, key, getFormattedString);
    });

    return maped.filter((notNull) => notNull).join(',');
  };

  return `[${getFormattedString(diffReport)}]`;
};

export default jsonFormarter;
