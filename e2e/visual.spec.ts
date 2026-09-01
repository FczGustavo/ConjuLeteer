import { mkdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const themes = ['dark','light','alexandria-dark','alexandria-light'] as const;
const viewports = [{name:'1440',width:1440,height:900},{name:'1024',width:1024,height:768},{name:'768',width:768,height:900},{name:'390',width:390,height:844}];

test('matriz visual dos quatro temas e resoluções', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  mkdirSync('reports/visual',{recursive:true});
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const viewport of viewports){
    await page.setViewportSize(viewport);
    for(const theme of themes){
      await page.goto('/');
      await page.evaluate(value => localStorage.setItem('conjuletter_settings_v1',JSON.stringify({theme:value,strictAccents:true,tableColumns:2,soundEffects:true,defaultBanca:'EsPCEx'})),theme);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await page.screenshot({path:`reports/visual/home-${theme}-${viewport.name}.png`,fullPage:true});
      if (theme === 'alexandria-light' && viewport.name === '1024') {
        await page.getByRole('button',{name:'Abrir navegação'}).click();
        await page.getByRole('button',{name:'Banco de Questões'}).click();
        const selected = page.locator('.question-filter-status-option[data-selected="true"]').first();
        await expect(selected).toBeVisible();
        await expect(selected).toHaveCSS('background-color', 'rgb(55, 111, 174)');
        await page.screenshot({path:'reports/visual/filter-alexandria-light-1024.png',fullPage:true});
      }
    }
  }
});

test('contrato público da API rejeita métodos, origens e payloads inválidos', async ({request}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  expect((await request.get('/api/ai/import')).status()).toBe(405);
  expect((await request.post('/api/ai/import',{data:{rawText:'x'.repeat(100),batch:1,totalBatches:1}})).status()).toBe(401);
  expect((await request.post('/api/ai/import',{headers:{Origin:'https://example.invalid'},data:{rawText:'x'.repeat(100),batch:1,totalBatches:1}})).status()).toBe(403);
  expect((await request.get('/api/health')).status()).toBe(200);
  expect((await request.post('/api/ai/import',{data:{rawText:'curto',batch:1,totalBatches:1}})).status()).toBe(400);
  const created = await request.post('/api/import/jobs', { data: { fileName: 'smoke.pdf', fileHash: `smoke-${Date.now()}`, totalPages: 2, totalBatches: 1 } });
  expect(created.status()).toBe(201);
  const jobId = (await created.json()).job.id as string;
  expect((await request.patch(`/api/import/jobs/${jobId}`, { data: { status: 'completed', processedPages: 2, verifiedCount: 1, quarantinedCount: 0, manifest: { coverage: 1 } } })).status()).toBe(200);
  expect((await request.get(`/api/import/jobs/${jobId}/report`)).status()).toBe(200);
  expect((await request.delete(`/api/import/jobs/${jobId}`)).status()).toBe(202);
});
