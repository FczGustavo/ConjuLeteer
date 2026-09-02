import { expect, test } from '@playwright/test';

test('Home, gaveta e troca de tema permanecem operáveis', async ({page}) => {
  await page.goto('/');
  await expect(page.getByText('A NOVA', {exact:false}).first()).toBeVisible();
  await page.getByRole('button',{name:'Abrir navegação'}).click();
  await page.getByRole('button',{name:'Tabelas'}).click();
  await expect(page.getByText('Conjugação Específica',{exact:false}).first()).toBeVisible();
  await page.getByRole('button',{name:'Abrir Configurações'}).click();
  await page.getByRole('button',{name:'Alexandria claro'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','alexandria-light');
});

test('Banco abre sem erros e apresenta filtros', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir navegação'}).click();
  await page.getByRole('button',{name:'Banco de Questões'}).click();
  await expect(page.getByRole('heading',{name:'Filtrar e Montar Questões'})).toBeVisible();
  await expect(page.getByText('Marcadas como não sei')).toBeVisible();
});

test('Inglês unificado mantém contagens dos dois corpora', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir navegação'}).click();
  await page.getByRole('button',{name:'Banco de Questões'}).click();
  await page.getByRole('button',{name:'Inglês', exact:true}).click();
  await expect(page.getByRole('button',{name:'Inglês (Todos os Assuntos)'})).toBeVisible();
  await expect(page.getByText('3310Q', {exact:true})).toBeVisible();
});

test('Preview agrupa bancas sem perder o crédito real nem o link oficial', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir navegação'}).click();
  await page.getByRole('button',{name:'Banco de Questões'}).click();
  await page.getByRole('button',{name:'Inglês', exact:true}).click();
  await expect(page.getByRole('button',{name:/Concursos estaduais e outras bancas \(<5Q\)/})).toBeVisible();
  await expect(page.getByRole('button',{name:/EEAr \(/i})).toBeVisible();
  await expect(page.getByRole('button',{name:/EEAr BCT \(/i})).toBeVisible();
  await page.getByRole('button',{name:/Pré-visualizar/}).click();
  const officialCredits = page.locator('a[data-source-credit][href^="https://"]');
  await expect(officialCredits.first()).toBeVisible();
  await expect(officialCredits.first()).not.toHaveAttribute('title', /PDF/i);
  const hrefs = await officialCredits.evaluateAll(anchors => anchors.map(anchor => (anchor as HTMLAnchorElement).href));
  expect(hrefs.every(href => href.startsWith('https://'))).toBe(true);
});

test('I have no idea revela o gabarito sem registrar acerto', async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium');
  await page.goto('/');
  await page.getByRole('button',{name:'Abrir navegação'}).click();
  await page.getByRole('button',{name:'Banco de Questões'}).click();
  await page.getByRole('button',{name:'Inglês', exact:true}).click();
  await page.getByRole('button',{name:/Pré-visualizar/}).click();
  const noIdea=page.getByRole('button',{name:'I have no idea'}).first();
  await noIdea.click();
  await expect(noIdea).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.question-option-row.bg-\\[\\#182a22\\]').first()).toBeVisible();
  await expect(page.getByText(/Resolvidas/).locator('..')).toContainText('0/');
});
