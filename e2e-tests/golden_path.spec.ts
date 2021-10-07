import { test, expect, Page } from '@playwright/test';

const APP_URL = process.env.TEST_E2E_APP_URL || 'http://localhost:3000/';
const USERNAME = process.env.TEST_E2E_USERNAME || '';
const USER_PASSWORD = process.env.TEST_E2E_PASSWORD || '';

test.describe.serial('Golden path', () => {
  test.skip(() => {
    if (!USERNAME || !USER_PASSWORD)
      console.log('Please provide credentials!');
    return !USERNAME || !USER_PASSWORD
  }, 'Please provide credentials!');

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
    await expect(page.url()).toBe(APP_URL + '/workflow/new');
  });

  test('Dry run', async () => {
    console.log("selected 1")
    await page.click('#intro-step .monaco-editor');
    console.log("selected 1.1")
    await page.keyboard.press('End');
    await page.keyboard.type('\nprint("test")');
    console.log("selected 2")
    const selected = await page.$$('.run_bar_run_button');
    console.log(selected)
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/auto/apply')),
      selected[1].click()
    ]);
    const sidebarResultText = await page.locator('.dataset_commit_info_text');
    const printOutText = await page.locator('.log_line_print_text');
    await expect(response.status()).toBe(200);
    await expect(printOutText).toHaveText('test');
    let runStatusIcons = await page.$$('.workflow_outline_status_container .run_status_icon_qrigreen');
    await expect(runStatusIcons.length).toBe(1);
    const columns = await page.locator('.body_header_columns_text');
    await expect(columns).toContainText('columns');
    await expect(sidebarResultText).toHaveText('new version from workflow');
    await page.click('#transform-cell .monaco-editor');
    await page.keyboard.press('End');
    await page.keyboard.type('\nprint("test")');
    const workflowPlaceholderText = await page.locator('#workflow_dataset_preview_empty_text');
    await expect(workflowPlaceholderText).toContainText('Dry run your code!');
    runStatusIcons = await page.$$('.workflow_outline_status_container .run_status_icon_qrigreen');
    await expect(runStatusIcons.length).toBe(0);

  });

  test('Adding a trigger', async () => {
    await page.click('#workflow_triggers_add_button');
    await page.click("#trigger_modal_cron");
    await page.click("#add_trigger_save_button");
    const schedule = await page.locator('#cron_trigger_schedule');
    await expect(schedule).toHaveText('Schedule')
    const selector = await page.locator('#cron_trigger_interval_text');
    await expect(selector).toContainText('Every day');
  });

  test('Deploy workflow', async () => {
    await page.click('#deploy_workflow_button');
    await page.fill('#dsName', workflowRandomName);
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ]);
    await expect(response.status()).toBe(200);
    const successText = await page.locator('#snack_bar_message_workflow_deployed');
    await expect(successText).toHaveText('Workflow Deployed');
    await page.click('#deploy_modal_done_button')
  });

  test('History update check', async () => {
    await page.goto(APP_URL + `ds/${USERNAME}/${workflowRandomName}/body`);
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text');
    await expect(versionInfoText).toHaveText('created dataset')
    const versionSelector = await page.locator('#dataset_commit_list_versions_text');
    await expect(versionSelector).toHaveText('1 version');
  });

  test('Checking if trigger is fine on workflow', async () => {
    await page.goto(APP_URL + `ds/${USERNAME}/${workflowRandomName}/workflow`);
    const selector = await page.locator('#cron_trigger_interval_text');
    await expect(selector).toContainText('Every day');
  });

  test('Deploying second version', async () => {
    await page.click('#setup-cell .monaco-editor');
    await page.keyboard.press('End');
    await page.keyboard.type('\nprint("test2")');
    await page.click('#deploy_workflow_button');
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ]);
    await expect(response.status()).toBe(200);
    const successText = await page.locator('#snack_bar_message_workflow_deployed');
    await expect(successText).toHaveText('Workflow Deployed');
    await page.click('#deploy_modal_done_button')
  });

  test('History second version update check', async () => {
    await page.goto(APP_URL + `ds/${USERNAME}/${workflowRandomName}/body`);
    const versionSelector = await page.locator('#dataset_commit_list_versions_text');
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text');
    await expect(versionSelector).toHaveText('2 versions');
    await expect(versionInfoText).toContainText('transform updated')
  });
});

