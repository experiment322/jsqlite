'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareStatement = prepareStatement;
exports.createResult = createResult;
function escapeText(t) {
  return String(t).replace(/'/g, "''");
}

function escapeIdentifier(i) {
  return String(i).replace(/"/g, '""');
}

function prepareStatement(statement, parameters) {
  var params = parameters.slice(0);
  return String(statement).replace(/\?+/g, function (match) {
    var param = params.shift() || '';
    switch (match.length) {
      case 1:
        return '\'' + escapeText(param) + '\'';
      case 2:
        return '"' + escapeIdentifier(param) + '"';
      default:
        return match;
    }
  });
}

function createResult(code, statement, result) {
  return Object.assign({ code: code, ok: !code }, statement && { statement: statement }, result && { result: result });
}