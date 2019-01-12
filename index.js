const domino = require('domino');
const nodeUrl = require('url');
const request = require('request-promise-native');
const vm = require('vm');

const dominoBrowser = function(baseBrowserDecorator) {
  baseBrowserDecorator(this);

  this.name = 'domino';

  this._start = async (url) => { // jshint ignore:line
    const fullUrl = new nodeUrl.URL(url); // jshint ignore:line
    const file = await request(fullUrl.href); // jshint ignore:line
    global.window = domino.createWindow(file, fullUrl.pathname);
    vm.createContext(window);

    const socketFileName = fullUrl.origin + '/socket.io/socket.io.js';
    const karmaFileName = fullUrl.origin + '/karma.js';
    const socketFile = await request(socketFileName); // jshint ignore:line
    const karmaFile = await request(karmaFileName); // jshint ignore:line

    vm.runInContext(socketFile, window, { filename: socketFileName, displayErrors: true });
    vm.runInContext(karmaFile, window, { filename: karmaFileName, displayErrors: true });

    const newSocket = fullUrl.origin + window.document.getElementsByTagName('script')[0].getAttribute('src').substring(7);

    const newSocketFile = await request(newSocket); // jshint ignore:line
    vm.runInContext(newSocketFile, window, { filename: newSocket, displayErrors: true});

    // console.log(window.document.serialize());
    // console.log(newSocketFile);
  };

  this.on('kill', (done) => {
    this.emit('done');
    process.nextTick(done);
  });
};

dominoBrowser.$inject = ['baseBrowserDecorator'];

module.exports = {
  'launcher:domino': ['type', dominoBrowser]
};
