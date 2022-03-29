import _ from 'lodash';

const defaultIndentBar = '  ';
const iterIndentBar = '    ';
const getIndent = (TABcount) => [iterIndentBar.repeat(TABcount), defaultIndentBar].join('');
const DIFF_SIGN_MAP = {
  deleted: '-',
  added: '+',
  same: ' ',
  updated: ' ',
  nested: ' ',
};

// render for DAS (Deleted, Added, Same)
const renderDAS = (key, body, diffSign, formartter, TABcount) => {
  const indent = getIndent(TABcount);
  const value = _.isObject(body.value)
    ? formartter(body.value, TABcount + 1)
    : body.value;

  return `${indent}${diffSign} ${key}: ${value}`;
};

const renderUpdated = (key, body, diffSign, formartter, TABcount) => {
  const indent = getIndent(TABcount);

  if (_.has(body.value, 'fromValue')) {
    const deletedSign = DIFF_SIGN_MAP.deleted;
    const addedSign = DIFF_SIGN_MAP.added;
    const changed = body.value;
    const fromValue = _.isObject(changed.fromValue)
      ? formartter(changed.fromValue, TABcount + 1)
      : changed.fromValue;
    const toValue = _.isObject(changed.toValue)
      ? formartter(changed.toValue, TABcount + 1)
      : changed.toValue;

    return `${indent}${deletedSign} ${key}: ${fromValue}\n${indent}${addedSign} ${key}: ${toValue}`;
  }

  return `${indent}${diffSign} ${key}: ${formartter(body.value, TABcount + 1)}`;
};

const renderNestedComplex = (key, body, diffSign, formartter, TABcount) => {
  const indent = getIndent(TABcount);
  const value = _.isObject(body) ? formartter(body, TABcount + 1) : body;

  return `${indent}${diffSign} ${key}: ${value}`;
};

const TYPE_RENDER_MAP = {
  deleted: (key, body, formartter, TABcount) => {
    const diffSign = DIFF_SIGN_MAP[body.type];
    return renderDAS(key, body, diffSign, formartter, TABcount);
  },
  added: (key, body, formartter, TABcount) => {
    const diffSign = DIFF_SIGN_MAP[body.type];
    return renderDAS(key, body, diffSign, formartter, TABcount);
  },
  same: (key, body, formartter, TABcount) => {
    const diffSign = DIFF_SIGN_MAP[body.type];
    return renderDAS(key, body, diffSign, formartter, TABcount);
  },
  updated: (key, body, formartter, TABcount) => {
    const diffSign = DIFF_SIGN_MAP[body.type];
    return renderUpdated(key, body, diffSign, formartter, TABcount);
  },
  nestedComlex: (key, body, formartter, TABcount) => {
    const diffSign = DIFF_SIGN_MAP.nested;
    return renderNestedComplex(key, body, diffSign, formartter, TABcount);
  },
};

const getResultRender = (body) => (_.has(body, 'value')
  ? TYPE_RENDER_MAP[body.type]
  : TYPE_RENDER_MAP.nestedComlex);

const stylishFormarter = (diff, TABcount = 0) => {
  const sorted = _.sortBy(Object.entries(diff), ([key]) => key);
  const maped = sorted.map(([key, body]) => {
    const resultRender = getResultRender(body);

    return resultRender(key, body, stylishFormarter, TABcount);
  });

  return `{\n${maped.join('\n')}\n${iterIndentBar.repeat(TABcount)}}`;
};

export default stylishFormarter;
