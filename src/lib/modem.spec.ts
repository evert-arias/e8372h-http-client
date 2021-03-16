import test from 'ava';

import Modem from './modem';

const modem = new Modem();

test('login', (t) => {
  t.true(modem.login());
});
