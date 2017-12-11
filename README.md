# jsqlite
JavaScript wrapper for SQLite compiled to JavaScript with Emscripten SDK.


## Compilation instructions
**Prerequisites**: [Emscripten SDK][emsdk], `tar` and `wget`(only if updating) available on `PATH`.

If you want to use a modified copy of SQLite or to simply update the library `cd` into `./lib/`. Then:
* To compile a modified copy of SQLite place an archive named `sqlite.tar.gz` in `./lib/` containing the modified source code.
* In `./lib/` execute the following commands `make && make clean` to rebuild the `sqlite.js` and if there is no `sqlite.tar.gz` in `./lib/`, one containing the latest version will be pulled from [here][sqlite].


## API Reference
* ```class DataBase { constructor(file) {...} }```
    * main class offering SQLite database abstraction and manipulation methods. `file` should be a string representing the db's file name in the virtual filesystem.
    * *Note: Instances of this class are denoted as `db` from now on.*

* ```db.open().then(() => {}).catch((err) => {})```
    * Open the connection to the database. Returns a promise and if it fails, an SQLite error code is passed to `catch`.
    * *Note: The database is created in memory and managed internally. To save it to a file use `db.dump()`.*

* ```db.exec(statement).then((output) => {}).catch((err) => {})```
    * Execute the SQL `statement` string and pass the `output` as an array of objects to `then`. If there is an error, `catch` is called with the SQLite error code.
    * *Note: To execute a `statement` the database should be opened first.*

* ```db.close().then(() => {}).catch((err) => {})```
    * Close the connection to the database. Returns a promise and if it fails, an SQLite error code is passed to `catch`.
    * *Note: The database isn't destroyed when closing it.*

* ```db.dump().then((data) => {}).catch((err) => {})```
    * Dump the database as an `Uint8Array` which is passed as a parameter to `then`. If there is an  error it is passed as a parameter to `catch` as a Linux error code.
    * *Note: `data` is an actual SQLite database which can be saved to a file and opened with a SQLite database manager.*

* ```db.restore(data).then(() => {}).catch((err) => {})```
    * Restore a previous dumped `data` or a `Uint8Array` obtained by reading a local SQLite database. If there is an  error it is passed as a parameter to `catch` as a Linux error code.
    * *Note: This action will overwrite the `db` actual content.*


## Error codes reference
* [Linux error codes][linux-err-codes]
* [SQLite error codes][sqlite-err-codes]


[emsdk]: http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html
[sqlite]: https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=release
[linux-err-codes]: https://github.com/torvalds/linux/blob/master/include/uapi/asm-generic/errno.h
[sqlite-err-codes]: https://sqlite.org/c3ref/c_abort.html
