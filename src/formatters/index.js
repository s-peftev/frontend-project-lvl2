import _ from 'lodash';
import stylishFormarter from './stylish.js';
import plainFormarter from './plain.js';
import jsonFormarter from './json.js';

const FORMARTER_MAP = {
  stylish: (data) => stylishFormarter(data),
  plain: (data) => plainFormarter(data),
  json: (data) => jsonFormarter(data),
};

export default (formarterName) => {
  if (!_.has(FORMARTER_MAP, formarterName)) {
    throw new Error(`Unknown formarter name: ${formarterName}`);
  }

  return FORMARTER_MAP[formarterName];
};
