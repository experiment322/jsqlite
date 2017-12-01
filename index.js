/* eslint no-underscore-dangle: 0 */
const UUID = require('uuid/v4');
const JSCRT = require('./lib/sqlite');

/* Runtime system modules */
const { FS, Runtime } = JSCRT;

/* C constants */
const PTR_SIZE = 4;
const SQLITE_OK = 0;

/* sqlite3_exec callback function mapping to js */
const execOutput = [];
const fetchOutput = () => execOutput.splice(0, execOutput.length);
const execCallback = Runtime.addFunction((_, colNo, valueArr, headerArr) => {
  const entry = {};
  for (let offset = 0; offset < colNo * PTR_SIZE; offset += PTR_SIZE) {
    const name = JSCRT.UTF8ToString(JSCRT.getValue(headerArr + offset, '*'));
    const value = JSCRT.UTF8ToString(JSCRT.getValue(valueArr + offset, '*'));
    entry[name] = value;
  }
  execOutput.push(entry);
});

/* sqlite3 c functions mapping to js */
const sqliteOpen = JSCRT.cwrap('sqlite3_open', 'number', ['string', 'number']);
const sqliteExec = JSCRT.cwrap('sqlite3_exec', 'number', ['number', 'string', 'number']);
const sqliteClose = JSCRT.cwrap('sqlite3_close', 'number', ['number']);

class DataBase {
  constructor() {
    this.db = null;
    this.file = UUID();
  }

  open() {
    return new Promise((resolve, reject) => {
      const dbPtr = JSCRT._malloc(PTR_SIZE);
      const retValue = sqliteOpen(this.file, dbPtr);
      if (retValue === SQLITE_OK) {
        this.db = JSCRT.getValue(dbPtr, '*');
        resolve();
      } else {
        reject(retValue);
      }
    });
  }

  exec(statement) {
    return new Promise((resolve, reject) => {
      const retValue = sqliteExec(this.db, String(statement), execCallback);
      if (retValue === SQLITE_OK) {
        resolve(fetchOutput());
      } else {
        reject(retValue);
      }
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      const retValue = sqliteClose(this.db);
      if (retValue === SQLITE_OK) {
        this.db = null;
        resolve();
      } else {
        reject(retValue);
      }
    });
  }

  dump() {
    return new Promise((resolve, reject) => {
      try {
        resolve(FS.readFile(this.file, { encoding: 'binary' }));
      } catch ({ errno }) {
        reject(errno);
      }
    });
  }

  restore(data) {
    return new Promise((resolve, reject) => {
      try {
        FS.writeFile(this.file, data, { encoding: 'binary' });
        resolve();
      } catch ({ errno }) {
        reject(errno);
      }
    });
  }
}

module.exports = { DataBase };
