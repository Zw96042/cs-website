import test from 'node:test';
import assert from 'node:assert/strict';
import { trimCodePadding } from './practice.js';

test('code samples remove PDF padding without losing indentation or interior spacing', () => {
  const sample = '\r\n \t\r\n  if (ready) {\r\n    out.print("  ");\r\n\r\n    return;\r\n  }\r\n \r\n\r\n';
  assert.equal(trimCodePadding(sample), '  if (ready) {\n    out.print("  ");\n\n    return;\n  }');
  assert.equal(trimCodePadding('  out.print(" ");  '), '  out.print(" ");  ');
  assert.equal(trimCodePadding(null), '');
});
