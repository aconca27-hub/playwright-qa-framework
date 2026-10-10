import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import users from '@data/users.json';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loggedIn: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  loggedIn: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
export { users };
