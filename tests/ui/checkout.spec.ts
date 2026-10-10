import { test, expect } from '@fixtures/test';
import scenarios from '@data/checkout.json';

test.describe('Checkout', () => {
  for (const scenario of scenarios) {
    test(`completes an order with ${scenario.name}`, async ({ loggedIn, cartPage, checkoutPage }) => {
      for (const item of scenario.items) {
        await loggedIn.addToCart(item);
      }
      await loggedIn.openCart();
      await cartPage.expectLoaded();
      await cartPage.expectItems(scenario.items);
      await cartPage.checkout();
      await checkoutPage.fillCustomer(scenario.customer);
      expect(await checkoutPage.subtotalAmount()).toBeGreaterThan(0);
      await checkoutPage.finish();
      await checkoutPage.expectComplete();
    });
  }

  test('postal code is required', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomer({ firstName: 'A', lastName: 'B', postalCode: '' });
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
