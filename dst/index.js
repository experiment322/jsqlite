'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint no-underscore-dangle: 0 */


var _sqlite = require('../lib/sqlite');

var _sqlite2 = _interopRequireDefault(_sqlite);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* c constants */
var PTR_SIZE = 4;
var SQLITE_OK = 0;

/* output buffer and sqlite3_exec callback function mapping to js */
var execOutput = [];
var execCallback = _sqlite2.default.addFunction(function (_, colNumber, valArray, keyArray) {
  var row = {};
  for (var offset = 0; offset < colNumber * PTR_SIZE; offset += PTR_SIZE) {
    var key = _sqlite2.default.UTF8ToString(_sqlite2.default.getValue(keyArray + offset, '*'));
    var val = _sqlite2.default.UTF8ToString(_sqlite2.default.getValue(valArray + offset, '*'));
    row[key] = val;
  }
  execOutput.push(row);
});

/* sqlite3 functions mapping to js */
var SQLite = {
  open: _sqlite2.default.cwrap('sqlite3_open', 'number', ['string', 'number']),
  exec: _sqlite2.default.cwrap('sqlite3_exec', 'number', ['number', 'string', 'number']),
  close: _sqlite2.default.cwrap('sqlite3_close', 'number', ['number'])
};

/* main class offering sqlite database abstraction */

var Database = function () {
  function Database() {
    var fileName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, Database);

    this.fileName = String(fileName);
    this.dbPointer = null;
  }

  _createClass(Database, [{
    key: 'open',
    value: function open() {
      if (this.dbPointer) {
        return (0, _util.createResult)(SQLITE_OK);
      }
      var dbPointer = _sqlite2.default._malloc(PTR_SIZE);
      var returnValue = SQLite.open(this.fileName, dbPointer);
      if (returnValue === SQLITE_OK) {
        this.dbPointer = _sqlite2.default.getValue(dbPointer, '*');
      }
      return (0, _util.createResult)(returnValue);
    }
  }, {
    key: 'exec',
    value: function exec(statement) {
      for (var _len = arguments.length, parameters = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        parameters[_key - 1] = arguments[_key];
      }

      var preparedStatement = (0, _util.prepareStatement)(statement, parameters);
      var returnValue = SQLite.exec(this.dbPointer, preparedStatement, execCallback);
      var result = returnValue === SQLITE_OK ? execOutput.splice(0) : null;
      return (0, _util.createResult)(returnValue, preparedStatement, result);
    }
  }, {
    key: 'close',
    value: function close() {
      if (!this.dbPointer) {
        return (0, _util.createResult)(SQLITE_OK);
      }
      var returnValue = SQLite.close(this.dbPointer);
      if (returnValue === SQLITE_OK) {
        this.dbPointer = null;
      }
      return (0, _util.createResult)(returnValue);
    }
  }, {
    key: 'dump',
    value: function dump() {
      try {
        return _sqlite2.default.FS.readFile(this.fileName, { encoding: 'binary' });
      } catch (_ref) {
        var errno = _ref.errno;

        throw errno;
      }
    }
  }, {
    key: 'load',
    value: function load(data) {
      try {
        _sqlite2.default.FS.writeFile(this.fileName, data, { encoding: 'binary' });
      } catch (_ref2) {
        var errno = _ref2.errno;

        throw errno;
      }
    }
  }]);

  return Database;
}();

exports.default = Database;