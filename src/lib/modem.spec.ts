import test from 'ava';

import Modem from './modem';

const data = {
  modemIp: '192.168.1.1',
  username: 'admin',
  password: '120630',
};

const modem = new Modem(data.modemIp);

// Initialize modem
test.serial('init', async (t) => {
  await modem.init();
  // Modem ready
  t.pass();
});

// Login
test.serial('login', async (t) => {
  await modem.login(data.username, data.password);
  t.pass();
});

// test.serial('ussd', async (t) => {
//   const result: string = (await modem.ussd('*222#')) as string;
//   t.is(result.startsWith('Saldo'), true);
// });
