function escapeText(t) {
  return String(t).replace(/'/g, "''");
}

function escapeIdentifier(i) {
  return String(i).replace(/"/g, '""');
}

export function prepareStatement(statement, parameters) {
  const params = parameters.slice(0);
  return String(statement).replace(/\?+/g, (match) => {
    const param = params.shift() || '';
    switch (match.length) {
      case 1: return `'${escapeText(param)}'`;
      case 2: return `"${escapeIdentifier(param)}"`;
      default: return match;
    }
  });
}

export function createResult(code, statement, result) {
  return Object.assign({ code, ok: !code }, statement && { statement }, result && { result });
}
