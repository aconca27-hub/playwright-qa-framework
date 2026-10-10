import { test, expect } from '@fixtures/test';

test.describe('Inventory', () => {
  test('shows six products', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('sorts by name Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.itemNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sorts by price low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.itemPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('cart badge counts added items', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('cart contents persist across reload', async ({ loggedIn, page, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Onesie');
    await page.reload();
    await loggedIn.openCart();
    await cartPage.expectItems(['Sauce Labs Onesie']);
  });
});
