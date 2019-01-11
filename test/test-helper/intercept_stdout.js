const intercept = require('intercept-stdout');

async function interceptStdout (options, fn) {
  const unhook = intercept(data => options.passthrough ? data : '');
  const result = await fn();
  unhook();
  return result;
}

module.exports = { interceptStdout };
