import test from 'ava';

import URLBuilder from './url-builder';

const modemIp = '192.168.1.1';
const testUrl = 'user/login';
const expectedUrl = `http://${modemIp}/api/${testUrl}`;

const builder = new URLBuilder(modemIp);

test('makeLoginUrl', (t) => {
  t.deepEqual(builder.make('user/login').toString(), expectedUrl);
});
