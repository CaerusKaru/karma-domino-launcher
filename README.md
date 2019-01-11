# karma-domino-launcher

> Launcher for [domino]. Based on the launcher for [jsdom]

## Installation

```bash
npm install karma-domino-launcher --save-dev
```

*NOTE:* karma and domino are peerDependencies of this module. If you haven't installed them, run

```bash
npm install karma-domino-launcher domino karma --save-dev
```

to install all your dependencies.

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['domino'],
  });
};
```

You can pass list of browsers as a CLI argument too:
```bash
karma start --browsers domino
```

## FAQ

### I am using Gulp and the test suite is not exiting

This occurs due to lingering event handlers and it is currently an [unsolved
issue][issue-4]. Meanwhile you have to explicitly exit the process yourself.
This can be done by not passing a callback to Karma.Server or by invoking
process.exit(), as shown below.

```javascript
var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('test', function () {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }).start();
});
```

```javascript
var gulp = require('gulp');
var Server = require('karma').Server;

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function (exitCode) {
    done();
    process.exit(exitCode);
  }).start();
});
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
[domino]: https://github.com/fgnass/domino
[jsdom]: https://github.com/jsdom/jsdom
[issue-4]: https://github.com/badeball/karma-jsdom-launcher/issues/4
