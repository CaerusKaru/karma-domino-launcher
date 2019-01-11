const {exec: origExec, spawn} = require("child_process");

function exec (...args) {
  return new Promise((resolve, reject) => {
    origExec(...args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = { exec, spawn };
