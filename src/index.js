/* eslint no-underscore-dangle: 0 */
import JSCRT from '../lib/sqlite';
import { createResult, prepareStatement } from './util';

/* c constants */
const PTR_SIZE = 4;
const SQLITE_OK = 0;

/* output buffer and sqlite3_exec callback function mapping to js */
const execOutput = [];
const execCallback = JSCRT.addFunction((_, colNumber, valArray, keyArray) => {
  const row = {};
  for (let offset = 0; offset < colNumber * PTR_SIZE; offset += PTR_SIZE) {
    const key = JSCRT.UTF8ToString(JSCRT.getValue(keyArray + offset, '*'));
    const val = JSCRT.UTF8ToString(JSCRT.getValue(valArray + offset, '*'));
    row[key] = val;
  }
  execOutput.push(row);
});

/* sqlite3 functions mapping to js */
const SQLite = {
  open: JSCRT.cwrap('sqlite3_open', 'number', ['string', 'number']),
  exec: JSCRT.cwrap('sqlite3_exec', 'number', ['number', 'string', 'number']),
  close: JSCRT.cwrap('sqlite3_close', 'number', ['number']),
};

/* main class offering sqlite database abstraction */
export class Database {
  constructor(fileName = '') {
    this.fileName = String(fileName);
    this.dbPointer = null;
  }

  open() {
    if (this.dbPointer) { return createResult(SQLITE_OK); }
    const dbPointer = JSCRT._malloc(PTR_SIZE);
    const returnValue = SQLite.open(this.fileName, dbPointer);
    if (returnValue === SQLITE_OK) { this.dbPointer = JSCRT.getValue(dbPointer, '*'); }
    return createResult(returnValue);
  }

  exec(statement, ...parameters) {
    const preparedStatement = prepareStatement(statement, parameters);
    const returnValue = SQLite.exec(this.dbPointer, preparedStatement, execCallback);
    const result = returnValue === SQLITE_OK ? execOutput.splice(0) : null;
    return createResult(returnValue, preparedStatement, result);
  }

  close() {
    if (!this.dbPointer) { return createResult(SQLITE_OK); }
    const returnValue = SQLite.close(this.dbPointer);
    if (returnValue === SQLITE_OK) { this.dbPointer = null; }
    return createResult(returnValue);
  }

  dump() {
    try {
      return JSCRT.FS.readFile(this.fileName, { encoding: 'binary' });
    } catch ({ errno }) {
      throw errno;
    }
  }

  load(data) {
    try {
      JSCRT.FS.writeFile(this.fileName, data, { encoding: 'binary' });
    } catch ({ errno }) {
      throw errno;
    }
  }
}

/* module offering virtual filesystem access */
export const Filesystem = JSCRT.FS;
