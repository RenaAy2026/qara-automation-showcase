import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

async function loginAs(page, username: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
}

async function getImageSources(page): Promise<string[]> {
  return page
    .locator('.inventory_item img')
    .evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).getAttribute('src') ?? ''));
}

test.describe('BUG-001: product images', () => {
  test('standard_user sees a different image for each product @regression', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const sources = await getImageSources(page);
    expect(sources.length).toBeGreaterThan(0);
    expect(new Set(sources).size).toBe(sources.length);
  });

  test('problem_user sees a different image for each product @known-bug', async ({ page }) => {
    test.fail(true, 'Known defect BUG-001: every product shows the same dog image');
    await loginAs(page, 'problem_user');
    const sources = await getImageSources(page);
    expect(sources.length).toBeGreaterThan(0);
    expect(new Set(sources).size).toBe(sources.length);
  });
});

test.describe('BUG-002: sort dropdown', () => {
  test('standard_user can sort Z to A @regression', async ({ page }) => {
    await loginAs(page, 'standard_user');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText(
      'Test.allTheThings() T-Shirt (Red)'
    );
  });

  test('problem_user can sort Z to A @known-bug', async ({ page }) => {
    test.fail(true, 'Known defect BUG-002: dropdown reverts to A to Z and the order does not change');
    await loginAs(page, 'problem_user');
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortBy('za');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('za');
    await expect(page.locator('[data-test="inventory-item-name"]').first()).toHaveText(
      'Test.allTheThings() T-Shirt (Red)'
    );
  });
});