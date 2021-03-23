import test from 'ava';

import Identity from './identity';

// Sample data for testing
const data = {
  username: 'admin',
  password: 'admin',
  token: 'example-token',
  expectedEncryptedPassword:
    'MDc2YTcxNzAxNGU4ZmY0NDg2MTJmZThmZjdhYzk1Zjg2MmEzODQ4ZmFiNTJhOGUyMzA1MDQ3NjNjYmQxMTgyMQ==',
};

// Identity class instance
const identity = new Identity(data.username, data.password, data.token);

// Get login object
test('getLoginObj', async (t) => {
  t.deepEqual(identity.getLoginObj(), {
    Username: data.username,
    Password: data.expectedEncryptedPassword,
    password_type: 4,
  });
});

// Get login object as xml
test('getLoginObjAsXml', async (t) => {
  t.deepEqual(
    identity.getLoginObjAsXml(),
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
  <Username>${data.username}</Username>
  <Password>${data.expectedEncryptedPassword}</Password>
  <password_type>4</password_type>
</root>`
  );
});
