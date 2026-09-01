import { expect, test } from '@playwright/test';

test('recorte visual carrega, amplia e restaura o foco', async ({ page }) => {
  await page.goto('/visual-fixtures/question-media.html');
  const trigger = page.getByRole('button', { name: /Ampliar imagem/ }).first();
  await expect(trigger).toBeVisible();
  await expect(trigger.locator('img')).toHaveAttribute('alt', 'Gráfico de barras comparando quatro grupos de estudo');
  await expect(page.getByRole('img', { name: 'Tirinha de Charlie Brown recortada da questão' })).toBeVisible();
  await expect(page.locator('figcaption')).toHaveCount(2);
  await expect(page.locator('figcaption')).toHaveText(['Recorte visual da questão', 'Recorte visual da questão']);
  const captions = await page.locator('figcaption').allTextContents();
  expect(captions.every(caption => !/pdf/i.test(caption))).toBe(true);
  await trigger.click();
  await expect(page.getByRole('dialog', { name: /Imagem ampliada/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: /Imagem ampliada/ })).toBeHidden();
  await expect(trigger).toBeFocused();
});
