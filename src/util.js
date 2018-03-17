function escapeText(s) {
  return String(s).replace(/'/g, "''");
}

function escapeIdentifier(i) {
  return String(i).replace(/"/g, '""');
}

export function prepareStatement(statement, parameters) {
  const params = parameters.slice(0);
  return String(statement).replace(/\?+/g, (match) => {
    const param = params.shift() || '';
    if (match.length === 1) { return `'${escapeText(param)}'`; }
    if (match.length === 2) { return `"${escapeIdentifier(param)}"`; }
    return match;
  });
}

export function createResult(code, statement, result) {
  return Object.assign({ code, ok: !code }, statement && { statement }, result && { result });
}
