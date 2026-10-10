import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly sort: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(itemName: string) {
    const item = this.items.filter({ hasText: itemName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async itemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async itemPrices(): Promise<number[]> {
    const raw = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return raw.map((p) => Number(p.replace('$', '')));
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sort.selectOption(option);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
