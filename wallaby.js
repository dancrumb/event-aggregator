module.exports = function wallabyConfig(wallaby) {
  return {
    files: [
      // The Mocha helper must be here so that `buildMochaOpts` can find it
      'test/test_helper.js',
      'test/EmitterFactory.js',
      'test/TestEmitter.js',
      'package.json',
      { pattern: 'src/*.js', load: false },
    ],
    tests: [
      'test/*.js',
      '!test/test_helper.js',
      '!test/EmitterFactory.js',
      '!test/TestEmitter.js',
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel(),
    },
    testFramework: 'mocha',
    env: {
      type: 'node',
      runner: 'node',
    },

    bootstrap() {
      require('./test/test_helper'); // eslint-disable-line global-require
    },
  };
};
