import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Shopping', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('adding one item shows 1 in the cart @smoke', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.expectCartCount(1);
  });

  test('removing an item updates the cart count @regression', async () => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');
    await inventoryPage.expectCartCount(2);
    await inventoryPage.removeFromCart('sauce-labs-backpack');
    await inventoryPage.expectCartCount(1);
  });

  test('sorting low to high orders prices correctly @regression', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});