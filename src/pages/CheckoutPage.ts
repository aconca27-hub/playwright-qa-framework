import { Page, Locator, expect } from '@playwright/test';

export type Customer = { firstName: string; lastName: string; postalCode: string };

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly subtotal: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotal = page.locator('[data-test="subtotal-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.error = page.locator('[data-test="error"]');
  }

  async fillCustomer(c: Customer) {
    await this.firstName.fill(c.firstName);
    await this.lastName.fill(c.lastName);
    await this.postalCode.fill(c.postalCode);
    await this.continueButton.click();
  }

  async subtotalAmount(): Promise<number> {
    const text = await this.subtotal.textContent();
    return Number(text?.replace(/[^0-9.]/g, ''));
  }

  async finish() {
    await this.finishButton.click();
  }

  async expectComplete() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
