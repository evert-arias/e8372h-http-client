import test from 'ava';
import dotenv from 'dotenv';

import { Modem } from './modem';

dotenv.config();

const modem = new Modem();

// Initialize modem
test.serial('init', async (t) => {
  await modem.init();
  // Modem ready
  t.pass();
});

// Login
test.serial('login', async (t) => {
  if (!process.env.TEST_MODEM_USERNAME) {
    t.fail('TEST_MODEM_USERNAME is missing');
  }
  if (!process.env.TEST_MODEM_PASSWORD) {
    t.fail('TEST_MODEM_PASSWORD is missing');
  }
  await modem.login(
    process.env.TEST_MODEM_USERNAME,
    process.env.TEST_MODEM_PASSWORD
  );
  t.pass();
});

// USSD request
test.serial('ussd', async (t) => {
  await modem.ussd('*222#');
  t.pass();
});
