import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await checkoutPage.startCheckout();
  });

  test('customer can complete an order @smoke', async () => {
    await checkoutPage.fillCustomerInfo('Test', 'User', '12345');
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('empty first name shows an error @regression', async () => {
    await checkoutPage.fillCustomerInfo('', 'User', '12345');
    await checkoutPage.expectError('First Name is required');
  });

  test('empty postal code shows an error @regression', async () => {
    await checkoutPage.fillCustomerInfo('Test', 'User', '');
    await checkoutPage.expectError('Postal Code is required');
  });
});
