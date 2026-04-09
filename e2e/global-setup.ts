import { FullConfig } from '@playwright/test';

import { TEST_EMAIL, TEST_PASSWORD } from './account.const';
import { checkIsDevelopment } from './check-env';
import { createAccount } from './create-account';

async function globalSetup(_config: FullConfig) {
  checkIsDevelopment();
  console.log('Seeding test user...');
  await createAccount(TEST_EMAIL, TEST_PASSWORD);
}

export default globalSetup;
