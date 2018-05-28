# jsqlite
JavaScript wrapper for SQLite compiled to JavaScript with Emscripten SDK.


## Installation
```npm i --save jsqlite```


## Usage
```javascript
/* import { Database, Filesystem } from 'jsqlite'; */
const { Database, Filesystem } = require('jsqlite');

/* create a new database */
const db = new Database('example.db');

/* open, execute statements and close */
if (db.open().ok) {
  const tableName = 'person';
  console.log(db.exec('CREATE TABLE ?? (id INTEGER PRIMARY KEY, name TEXT NOT NULL);', tableName));
  console.log(db.exec('INSERT INTO ?? VALUES (null, ?);', tableName, 'John'));
  console.log(db.exec('INSERT INTO ?? VALUES (null, ?);', tableName, 'Jane'));
  console.log(db.exec('SELECT * FROM ??;', tableName));
  console.log(db.exec('SELECT SQLITE_VERSION();'));
  db.close();
}

/* delete the database file to avoid useless memory usage */
Filesystem.unlink('example.db');
```


## (Re)Compilation
**Prerequisites**: [Emscripten SDK][emsdk], `tar` and `wget`(only if updating) available on `PATH`.

If you want to use a modified copy of SQLite or to simply update the library `cd` into `./lib/`. Then:
* To compile a modified copy of SQLite place an archive named `sqlite.tar.gz` in `./lib/` containing the modified source code.
* In `./lib/` execute the following commands `make && make clean` to rebuild the `sqlite.js`. If there is no `sqlite.tar.gz` in `./lib/` one containing the latest version of SQLite will be pulled from [here][sqlite].


## API Reference
* ```Filesystem```
    * Check [here][em-fs] for Emscripten filesystem API.

* ```Database { constructor(fileName = '') }```
    * Main class offering SQLite database abstraction and manipulation methods. `fileName` should be a string representing the database's file name in the virtual filesystem. If it is missing then it is initialized with an empty string and the database becomes temprary(it cannot be dumped, its contents being lost when closed). Check [here][sqlite-inmemdb] for other special strings for temporary databases.
    * *Note: Instances of this class are denoted as `db` from now on.*

* ```db.open() => {code, ok}```
    * Open the connection to the database. Returns an object containing the return code of `sqlite3_open` in `code`, a boolean `ok` to simplify error checking, being `false` when there is an error, `true` otherwise.
    * *Note: The database is created in memory and managed internally. To save it to a file use `db.dump()` if it isn't temporary.*

* ```db.exec(statement, ...parameters) => {code, ok, statement, result}```
    * Execute the SQL `statement` string, replacing every `??` and `?` with every value given in `parameters` in the same order. `??` is used for escaping identfiers and `?` is used for escaping strings. Every parameter will be converted to string before escaping. Returns an object which contains the return code of `sqlite3_exec` in `code`, the boolean `ok`, the final(escaped) executed statement in `statement` and the result of the execution as an array of objects in `result`.
    * *Note: To execute a `statement` the database should be opened first.*

* ```db.close() => {code, ok}```
    * Close the connection to the database. Returns an object containing the return code of `sqlite3_close` in `code` and the boolean `ok`.
    * *Note: The database isn't destroyed when closing it except when the `fileName` represents a temporary database.*

* ```db.dump() => Uint8Array```
    * Dump the database. Returns an `Uint8Array` which is the binary representation of the database. Throws a [linux error code][linux-err-codes] if there is an error.
    * *Note: The returned `Uint8Array` is an actual SQLite database which can be saved to a file and opened with a SQLite database manager.*

* ```db.load(data)```
    * Restore a previous dumped database or an `Uint8Array` obtained by reading another SQLite database. Throws a [linux error code][linux-err-codes] if there is an error.
    * *Note: This action will overwrite the `db` actual content.*


## Error codes reference
* [Linux error codes][linux-err-codes]
* [SQLite error codes][sqlite-err-codes]


[emsdk]: http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html
[em-fs]: https://kripken.github.io/emscripten-site/docs/api_reference/Filesystem-API.html
[sqlite]: https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release
[sqlite-inmemdb]: https://www.sqlite.org/inmemorydb.html
[linux-err-codes]: https://github.com/torvalds/linux/blob/master/include/uapi/asm-generic/errno.h
[sqlite-err-codes]: https://sqlite.org/c3ref/c_abort.html
