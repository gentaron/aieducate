import test from 'node:test';
import assert from 'node:assert/strict';
import { getJwtSecret } from '../src/jwt-secret.ts';

test('missing, blank, placeholder and short JWT keys fail closed', () => {
  for (const value of [undefined, '', '   ', 'your-secret-key-change-in-production', 'short']) {
    assert.throws(() => getJwtSecret(value));
  }
});

test('configured high-length keys are preserved exactly', () => {
  const value = 'test-only-key-with-more-than-32-characters';
  assert.equal(getJwtSecret(value), value);
});
