import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async expectItems(names: string[]) {
    await expect(this.items).toHaveCount(names.length);
    for (const name of names) {
      await expect(this.items.filter({ hasText: name })).toHaveCount(1);
    }
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
