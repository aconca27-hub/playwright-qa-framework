import { test, expect, users } from '@fixtures/test';

test.describe('Login', () => {
  test('standard user lands on the inventory page', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees the lockout message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, 'not-the-password');
    await loginPage.expectError('Username and password do not match');
  });

  test('empty form asks for a username', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginButton.click();
    await loginPage.expectError('Username is required');
  });
});
