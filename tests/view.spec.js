import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:8001/');

  await expect(page).toHaveTitle(/ToDo/);
});

test('increase click increases count to 1', async ({ page }) => {
  await page.goto('http://localhost:8001/');

  const counter = page.locator('span')

  await page.getByText('Increase').click();

  await expect(counter).toHaveText('Count: 1');
});

test('decrease click increases count to 1', async ({ page }) => {
  await page.goto('http://localhost:8001/');

  const counter = page.locator('span')

  await page.getByText('Decrease').click();

  await expect(counter).toHaveText('Count: -1');
});