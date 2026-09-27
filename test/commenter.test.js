import { test } from 'node:test';
import assert from 'node:assert/strict';
// eslint-disable-next-line import/extensions
import { formatCommenterName } from '../src/utils/commenter.js';

// The comments query returns `commenter` as a double-encoded JSON string, or null when
// the comment has no commenter row (commenter_id NULL); commenterFirstName/LastName are
// resolved separately by the backend.
const encode = (value) => JSON.stringify(JSON.stringify(value));

test('user commenter keeps its username', () => {
  assert.equal(
    formatCommenterName({ commenterTypeName: 'user', commenter: encode({ username: 'ot_bujumbura' }) }),
    'User: ot_bujumbura',
  );
});

test('individual commenter keeps its first and last name', () => {
  assert.equal(
    formatCommenterName({
      commenterTypeName: 'individual',
      commenter: encode({ firstName: 'Aline', lastName: 'Niyonzima' }),
    }),
    'Individual: Aline Niyonzima',
  );
});

test('no commenter type stays anonymous', () => {
  assert.equal(formatCommenterName({ commenterTypeName: null, commenter: null }), 'Anonymous User');
});

test('user comment with a null commenter falls back to commenterFirstName/LastName', () => {
  assert.equal(
    formatCommenterName({
      commenterTypeName: 'user', commenter: null, commenterFirstName: 'Jean', commenterLastName: 'Ndayishimiye',
    }),
    'User: Jean Ndayishimiye',
  );
});

test('user comment with a null commenter and no name is shown as Système', () => {
  assert.equal(
    formatCommenterName({
      commenterTypeName: 'user', commenter: null, commenterFirstName: null, commenterLastName: null,
    }),
    'Système',
  );
});

test('individual comment with a null commenter and no name is shown as Système', () => {
  assert.equal(formatCommenterName({ commenterTypeName: 'individual', commenter: null }), 'Système');
});

test('a "null" JSON string and an already parsed object are both accepted', () => {
  assert.equal(formatCommenterName({ commenterTypeName: 'user', commenter: '"null"' }), 'Système');
  assert.equal(
    formatCommenterName({ commenterTypeName: 'user', commenter: { username: 'admin' } }),
    'User: admin',
  );
});

test('a user commenter without username uses the resolved names', () => {
  assert.equal(
    formatCommenterName({
      commenterTypeName: 'user', commenter: encode({}), commenterFirstName: 'Claire', commenterLastName: null,
    }),
    'User: Claire',
  );
});

test('a commenter string that is not JSON does not throw', () => {
  assert.equal(
    formatCommenterName({ commenterTypeName: 'user', commenter: 'not json', commenterFirstName: 'Eric' }),
    'User: Eric',
  );
});
