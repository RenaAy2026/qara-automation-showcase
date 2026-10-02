import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  async addToCart(productSlug: string) {
    await this.page.locator(`[data-test="add-to-cart-${productSlug}"]`).click();
  }

  async removeFromCart(productSlug: string) {
    await this.page.locator(`[data-test="remove-${productSlug}"]`).click();
  }

  async expectCartCount(count: number) {
    await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(String(count));
  }

  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async sortBy(option: string) {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }
}