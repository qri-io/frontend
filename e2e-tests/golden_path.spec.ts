import { test, expect, Page } from '@playwright/test'

const APP_URL = process.env.TEST_E2E_APP_URL || 'http://localhost:3000'

test.describe.serial('Golden path', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await page.close()
  })

  const workflowRandomName = `qri_test_${Math.floor(new Date().valueOf() / 1000)}`
  const testUserName = `qri_test_user${Math.floor(new Date().valueOf() / 1000)}`

  test('Sign up', async () => {
      await page.goto(APP_URL)
      await page.click('#user_menu_sign_up_button')
      await page.fill('#email', testUserName+'@qri.com')
      await page.fill('#username', testUserName)
      await page.fill('#password', '1234qwerty')
      await page.waitForTimeout(1000)
      const [response] = await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/profile/new?__code')),
        await page.click('#sign_up_modal_submit_button')
      ])
      await expect(response.status()).toBe(200)
      await page.click('.session_user_menu')
      await page.click('.session_user_menu span:has-text("Log Out")')
      await page.waitForTimeout(2000)
    })

  test('Log in', async () => {
    await page.click('#user_menu_login_button')
    await page.fill('#username', testUserName)
    await page.fill('#password', '1234qwerty')
    await page.waitForTimeout(1000)
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/profile')),
      await page.click('#login_modal_login_button')
    ])
    await expect(response.status()).toBe(200)
  })


  test('go to new dataset page', async () => {
    await page.click('#new_dataset_button')
    await page.click('#new_dataset_modal_create_workflow')
    await page.click('#splash_modal_workflow_button')
    await expect(page.url()).toBe(APP_URL + '/workflow/new')
  })

  test('Dry run', async () => {
    await page.waitForTimeout(2000)

    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/auto/apply')),
      page.click('.dataset_fixed_layout .run_bar_run_button')
    ])
    await page.click('.dataset_fixed_layout .run_bar_run_button')
    await page.waitForTimeout(2000)
    await expect(response.status()).toBe(200)
    const printOutText = await page.locator('.log_line_print_text')
    await expect(printOutText).toHaveText('Hello, World!')
    const columns = await page.locator('.body_header_columns_text')
    await expect(columns).toContainText('columns')
  })

  test('Adding a trigger', async () => {
    await page.click('#workflow_triggers_add_button')
    await page.click("#workflow_trigger_schedule_button")
    await page.click("#add_trigger_save_button")
    const schedule = await page.locator('#cron_trigger_schedule')
    await expect(schedule).toHaveText('Schedule')
    const selector = await page.locator('#cron_trigger_interval_text')
    await expect(selector).toContainText('Every day')
  })

  test('Deploy workflow', async () => {
    await page.click('.dataset_fixed_layout .deploy_workflow_button')
    await page.fill('#dsName', workflowRandomName)
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ])
    await expect(response.status()).toBe(200)
    const successText = await page.locator('#snack_bar_message_workflow_deployed')
    await expect(successText).toHaveText('Workflow Deployed')
    await page.click('#deploy_modal_done_button')
  })

  test('History update check', async () => {
    await page.goto(APP_URL + `/${testUserName}/${workflowRandomName}/history#body`)
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text')
    await expect(versionInfoText).toHaveText('created dataset')
    const versionSelector = await page.locator('#dataset_commit_list_versions_text')
    await expect(versionSelector).toHaveText('1 version')
  })

  test('Checking if trigger is fine on workflow', async () => {
    await page.goto(APP_URL + `/${testUserName}/${workflowRandomName}/workflow`)
    const selector = await page.locator('#cron_trigger_interval_text')
    await expect(selector).toContainText('Every day')
  })

  test('Deploying second version', async () => {
    await page.click('#download-example-cell .monaco-editor')
    await page.keyboard.press('End')
    await page.keyboard.type('\nprint("test")')
    await page.click('.dataset_fixed_layout .deploy_workflow_button')
    await page.waitForTimeout(2000)
    const [response] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('auto/deploy')),
      await page.click("#deploy_modal_deploy_button")
    ])
    await expect(response.status()).toBe(200)
    const successText = await page.locator('#snack_bar_message_workflow_deployed')
    await expect(successText).toHaveText('Workflow Deployed')
    await page.click('#deploy_modal_done_button')
  })

  test('History second version update check', async () => {
    await page.goto(APP_URL + `/${testUserName}/${workflowRandomName}/history#body`)
    const versionSelector = await page.locator('#dataset_commit_list_versions_text')
    const versionInfoText = await page.locator('.commit_summary_header_container .dataset_commit_info_text')
    await expect(versionSelector).toHaveText('2 versions')
    await expect(versionInfoText).toContainText('transform updated steps.1.script')
  })

  test('Delete created dataset', async () => {
    await page.goto(APP_URL + '/collection')
    await page.click(`#${workflowRandomName}`)
    await page.click(`#${workflowRandomName} .dropdown_menu_item`)
    await page.click('#modal_layout_action_button')
    await page.waitForTimeout(1000)
    const countSelector = await page.locator('#collection_count')
    await expect(countSelector).toHaveText('0')
  })
})
