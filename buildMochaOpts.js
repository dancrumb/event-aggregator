import glob from 'glob';
import _ from 'lodash';
import wallaby from './wallaby';

const fakeWallaby = {
  compilers: {
    babel() {
      return 'js:babel-register';
    },
  },
};

const config = wallaby(fakeWallaby);

const mochaRequire = config.files[0];
const compilers = config.compilers['**/*.js'];

const testFiles = _(config.tests).map(wildcard => glob.sync(wildcard)).flatten();

console.log(`--compilers ${compilers}`); // eslint-disable-line no-console
console.log(`--require ${mochaRequire}`); // eslint-disable-line no-console
console.log(testFiles.join('\n')); // eslint-disable-line no-console
