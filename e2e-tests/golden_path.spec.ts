import { test, expect, Page } from '@playwright/test';

const APP_URL = process.env.TEST_E2E_APP_URL  || 'http://localhost:3000/';
const USERNAME = process.env.TEST_E2E_USERNAME || '';
const USER_PASSWORD = process.env.TEST_E2E_PASSWORD || '';

test.describe.serial('Golden path', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  const workflowRandomName = `qri_test_${Math.floor(new Date().valueOf() / 1000)}`;

  test('Log in', async () => {
    await page.goto(APP_URL);
    await page.click('#user_menu_login_button');
    await page.fill('#username', USERNAME);
    await page.fill('#password', USER_PASSWORD);
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/oauth/token?grant_type=password')),
      await page.click('#login_modal_login_button')
    ]);
    await expect(response.status()).toBe(200);
  });

  test('go to new dataset page', async () => {
    await page.click('#new_dataset_button');
    await page.click('#splash_modal_workflow_button');
    await expect(page.url()).toBe(APP_URL+'workflow/new');
  });

  test('Dry run', async () => {
    await page.click('#setup-cell .monaco-editor');
    await page.keyboard.type('\nprint("test")');
    const selected = await page.$$('.run_bar_run_button');
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/auto/apply')),
      selected[1].click()
    ]);
    await expect(response.status()).toBe(200);
  });

  test('Adding a trigger', async () =>{
    await page.click('#workflow_triggers_add_button');
    await page.click("#trigger_modal_cron");
    await page.click("#add_trigger_save_button");
    const schedule = await page.locator('#cron_trigger_schedule');
    await expect(schedule).toHaveText('Schedule')
  });

  test('Deploy workflow', async () =>{
    await page.click('#deploy_workflow_button');
    await page.fill('#dsName', workflowRandomName);
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ]);
    await expect(response.status()).toBe(200);
    await page.click('#deploy_modal_done_button')
  });

  test('History update check', async () =>{
    await page.goto(APP_URL+`ds/${USERNAME}/${workflowRandomName}/body`);
    const versionSelector = await page.locator('#dataset_commit_list_versions_text');
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text');
    await expect(versionSelector).toHaveText('1 version');
    await expect(versionInfoText).toHaveText('created dataset')
  });

  test('Checking if trigger is fine on workflow', async () => {
    await page.goto(APP_URL+`ds/${USERNAME}/${workflowRandomName}/workflow`);
    const selector = await page.locator('#cron_trigger_interval_text');
    await expect(selector).toContainText('Every day');
  });

  test('Deploying second version', async () => {
    await page.click('#setup-cell .monaco-editor');
    await page.keyboard.type('\nprint("test2")');
    await page.click('#deploy_workflow_button');
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ]);
    await expect(response.status()).toBe(200);
    await page.click('#deploy_modal_done_button')
  });

  test('History second version update check', async () =>{
    await page.goto(APP_URL+`ds/${USERNAME}/${workflowRandomName}/body`);
    const versionSelector = await page.locator('#dataset_commit_list_versions_text');
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text');
    await expect(versionSelector).toHaveText('2 versions');
    await expect(versionInfoText).toContainText('transform updated')
  });
});

