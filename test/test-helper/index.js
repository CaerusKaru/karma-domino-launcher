const {COPY_KARMA} = process.env;
const {tmpdir} = require('os');
const {writeFile} = require('./fs');
const {join} = require('path');
const {randomBytes} = require('crypto');
const {interceptStdout} = require('./intercept_stdout');
const {Server} = require('karma');

// As per 3.0.0 [1], Karma will attempt to clear the console of any content.
// With jsdom and node, this translates into ^[1];1H^[0J and your terminal is
// cleared. This isn't desirable and thus we remove the method.
//
// [1] https://github.com/karma-runner/karma/blob/v3.0.0/client/karma.js#L223
console.clear = null;

if (console.clear) {
  console.error('Unable to remove console.clear(), exiting…');
  process.exit(1);
}

function generateRandomFilePath() {
  return join(
    tmpdir(),
    randomBytes(20).toString('hex') + '.js');
}

async function createKarmaTest(testFunction) { // jshint ignore:line
  const tmpTestFile = generateRandomFilePath();

  const config = {
    files:         [tmpTestFile],
    frameworks:    ['mocha'],
    browsers:      ['domino'],
    singleRun:     true,
  };

  // jshint ignore:start
  await writeFile(tmpTestFile, `
    it('dummy description', ${testFunction.toString()});
  `);

  await interceptStdout({ passthrough: COPY_KARMA === '1' }, () => {
    return new Promise((resolve, reject) => {
      new Server(config, (exitCode) => {
        if (exitCode === 0) {
          resolve();
        } else {
          reject(new Error(`The Karma test errored. Run with COPY_KARMA=1 to see Karma's output.`));
        }
      }).start();
    });
  });
  // jshint ignore:end
}

module.exports = {
  createKarmaTest
};
