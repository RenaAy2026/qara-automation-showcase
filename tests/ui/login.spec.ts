import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('valid user can log in @smoke', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('wrong password shows an error @regression', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('locked out user cannot log in @regression', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectError('this user has been locked out');
  });
});