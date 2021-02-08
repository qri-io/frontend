import puppeteer from 'puppeteer'

import { startupBackendApp, startUpFrontendApp } from './utils/specHelpers'
import TestQrimaticFrontend from './utils/testFrontendServe'
import TestQrimaticBackend from './utils/testQrimaticServe'

let backend: TestQrimaticBackend
let frontend: TestQrimaticFrontend
let headless: boolean
let browser: puppeteer.Browser
let page: puppeteer.Page


beforeAll(async () => {
  jest.setTimeout(60 * 1000)
  backend = await startupBackendApp()
  frontend = await startUpFrontendApp()
  // determine if tests should run in headless browser
  headless = process.env.HEADLESS_CHROME === 'true'
})

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless,
    slowMo: 100
  })
  page = await browser.newPage()

  page.emulate({
    viewport: {
      width: 1000,
      height: 2000
    },
    userAgent: ''
  })
})

afterEach(async () => {
  await browser.close()
})

afterAll(async () => {
  await backend.close()
  await frontend.close()
  await browser.close()
}, 200)

test('load splash page', async () => {
  await page.goto('http://localhost:3000/')
  await page.waitForSelector('title')

  const html = await page.$eval('title', e => e.innerHTML)
  expect(html).toBe('Home | Qri Cloud')
})

test('happy path', async () => {
  await page.goto('http://localhost:3000/')
  await page.waitForSelector("#new-dataset-button")

  await page.click('#new-dataset-button')
  expect(page.url()).toContain('/ds/new')

  await page.click('#CSVDownload')
  await page.waitForSelector('#workflow')

  await page.click('#setup-cell .monaco-editor')
  await page.keyboard.type('\nprint("hello!")',{delay: 20})
  await page.click('#dry-run')
  await page.waitForSelector('#succeeded')

  // puppeteer works mainly through promises
  // you can nest "await"s, but I found that supremely ugly/confusing
  // `page.evalutate` is the key when trying to get at the underlying element
  // one gotchya: whatever ElementHandle you want to pass actually evalute
  // (aka the one that you pass into the evalute anonymous function), must be
  // the second param of the `evalute` function. You can pass an object of
  // elements/additional params, that you can destructure inside the anonymous
  // function
  const setupOutput = await page.$('#setup-cell .output')
    .then(async el => {
      return await page.evaluate((el: HTMLElement) => {
        // things get messy if we cannot find the the given element
        // throw here so we can see what when wrong in the test
        if (!el) {throw "cannot get setup output"}
        return el.innerText
      }, el)
    })
  expect(setupOutput).toContain("hello!")

  // note: in order to interact with the monaco editor, you must click into the
  // specific editor and interact by using the puppeteer keyboard API
  await page.click('#download-cell .monaco-editor')
  // note: no need to add formating whitespace, monaco editor does this
  // automatically when you type "enter"
  await page.keyboard.type('\nbadcode',{delay: 20})
  await page.click('#dry-run')
  await page.waitForSelector('#failed')
  
  const downloadOutput = await page.$('#download-cell .output')
    .then(async el => {
      return await page.evaluate((el: HTMLElement) => {
        if (!el) {throw "cannot get download output"}
        return el.innerText
      }, el)
    })
  expect(downloadOutput).toContain('undefined: badcode')

  await page.click("#download-cell .monaco-editor")
  await page.evaluate(() => document.execCommand("selectAll", true))
  const downloadCode = '# get the popular baby names dataset as a csv\ndef download(ctx):\ncsvDownloadUrl = "https://data.cityofnewyork.us/api/views/25th-nujf/rows.csv?accessType=DOWNLOAD"\nreturn http.get(csvDownloadUrl).body()'
  await page.keyboard.type(downloadCode)
  await page.click('#dry-run')
  await page.waitForSelector('#succeeded')
  await page.waitForSelector('#dataset-preview')
  
  // TODO (ramfox): when we get this functionality up and running, we can comment
  // these tests back in
  // await page.click('#select-schedule')
  // TODO (ramfox): do we really want to have 'minute' be an option?
  // await page.click('#minute')
  // await page.click('#deploy')
  // await page.waitForSelector('#deploy-modal')
  // await page.click('#submit')

  // await page.click('#menu')
  // await page.click('#back-to-collection')
  // // need to figure out what this id should be
  // const workflowItemId = '#workflow-unique-name'
  // const workflowItemEl = await page.$(workflowItemId).then(el => {
  //   if (!el) throw "cannot find workflow item element"
  //   return el
  // })
  // const workflowItemText = await page.evaluate(async (workflowItemEl: puppeteer.ElementHandle<Element>) => {
  //   return await workflowItemEl.$('.update-status').then(async updateEl => {
  //     if (!updateEl) throw 'cannot find update-status element'
  //     await page.evaluate(el => {
  //       return el.innerText
  //     }, updateEl)
  //   })

  // }, workflowItemEl)
  // expect(workflowItemText).toContain('never run')

  // await workflowItemEl.click()
  // await page.click('#run-and-save')
  // await page.click('#menu')
  // await page.click('#back-to-collection')

  // await page.waitForSelector(`${workflowItemId} .success`)

  // await workflowItemEl.click()
  // await page.waitForSelector('#setup-cell')
  // await page.click('#setup-cell .monaco-editor')
  // await page.keyboard.type('badcode',{delay: 20}) 
  // await page.click('#run-and-save')
  // await page.click('#menu')
  // await page.click('#back-to-collection')
  // await page.waitForSelector(`${workflowItemId} .failure`)

  // note: jest was timing out on this test sometimes
  // extended the time beyond the default 6 * 1000 defined above
}, 90000)

// first time user flow
/**
 * - start at root
 * - click on try it out now
 * - be on new dataset page
 * - click "csv download"
 * - be on workflow page
 * - click "dry run"
 * - opens "create account" modal w/ "if you want to run this workflow, create an account!" text
 * - click "deploy"
 * - opens "create account" modal w/ "if you want to run this workflow, create an account!" text
 * - click "run and save"
 * - opens "create account" modal w/ "if you want to run this workflow, create an account!" text
 * - click to new route
 * - opens" create account" modal w/ "if you want to save your work, sign up for an account" text
 */
// test('first time user flow', async () => {
//   await page.goto('http://localhost:3000/')
//   // await page.click('#app > div.route-content.h-full > div > div.bg-qriblue.text-white.text-bold.flex.p-4.items-center > a.px-4')
//   await page.click("#new-dataset-button")
// } )

// create account flow
/**
 * - start at root
 * - click sign up
 * - enter username, password, email address
 * - enter verification code
 * - redirect to new dataset page
 */

// log in
/**
 * - start at root
 * - click login
 * - fill in username and password (email and password?)
 * - redirect to collection view
 */

// main flow


  // to avoid erroring as a duplicate user on signin test,
  // we use a hashed timestamp appended to the test base user email and name
  // const testUserHash = Date.now().toString(36)
  // const baseTestUser = 'qri_temp_cloud_e2e'
  // const defaultUserEmail = `${baseTestUser}+${testUserHash}@gmail.com`
  // const defaultUsername = `${baseTestUser}_${testUserHash}`
  // const defaultPassword = 'qriCloudE2ETestPassword123'

  // this is a qri peer used exclusively for this e2e test suite
  // the user's password is same as defaultPassword above
  // const testQriUser = 'qri_cloud_e2e_test_user_jeixhyys'
  // const testQriUser1 = 'qri_cloud_e2e_test_user_aoenxuqq'
  // const testDatasetRoute = `${testQriUser}/world_bank_hnp_stats`
  // const testDatasetRoute1 = `${testQriUser1}/nyc_green_taxi_june`

  // const signInUserFlow = async () => {
  //   await page.goto('http://localhost:3000/')

  //   // click "Sign In"
  //   await page.waitForSelector('a[href=\'#\']', { visible: true })
  //   await page.click('a[href=\'#\']')

  //   await page.waitForSelector('form[action=\'/signin\'', { visible: true })
  //   await page.click('input[name=\'username\']')
  //   await page.type('input[name=\'username\']', testQriUser)
  //   await page.click('input[name=\'password\']')
  //   await page.type('input[name=\'password\']', defaultPassword)
  //   await page.click('form[action=\'/signin\'] button')

  //   // make sure user is signed in
  //   await page.waitForSelector('a[href=\'#\']', { visible: true })
  //   const usernameText = await page.$eval('a[href=\'#\']', e => e.textContent)
  //   expect(usernameText).toBe(testQriUser)
  // }

  // it('sign up new user', async () => {
  //   await page.goto('http://localhost:3000/')

  //   // click "Sign In"
  //   await page.waitForSelector('a[href=\'#\']', { visible: true })
  //   await page.click('a[href=\'#\']')

  //   // click "Sign Up"
  //   await page.waitForSelector('a[href=\'/signup\']', { visible: true })
  //   await page.click('a[href=\'/signup\']')

  //   await page.waitForSelector('#signup', { visible: true })
  //   await page.click('input[name=\'email\']')
  //   await page.type('input[name=\'email\']', defaultUserEmail)
  //   await page.click('input[name=\'username\']')
  //   await page.type('input[name=\'username\']', defaultUsername)
  //   await page.click('input[name=\'password\']')
  //   await page.type('input[name=\'password\']', defaultPassword)

  //   await page.click('#termsCheck')
  //   await page.click('#signup button')

  //   // navigates auth'd user to splash page
  //   await page.waitForSelector('a[href=\'#\']', { visible: true })
  //   const usernameText = await page.$eval('a[href=\'#\']', e => e.textContent)
  //   expect(usernameText).toBe(defaultUsername)
  // })

  // it('sign in and sign out', async () => {
  //   await signInUserFlow()

  //   // click "Sign Out"
  //   await page.click('#navbarDropdownMenuLink')
  //   await page.click('a[href=\'/signout\']')

  //   await page.waitForSelector('a[href=\'#\']', { visible: true })
  //   const signInText = await page.$eval('a[href=\'#\']', e => e.textContent)
  //   expect(signInText).toBe('Sign In')
  // })

  // it('navigate from dataset preview tab at HEAD to historical commit', async () => {
  //   await page.goto(`http://localhost:3000/${testDatasetRoute1}`)

  //   // confirm dataset title is as expected
  //   await page.waitForSelector('.dataset-header-title', { visible: true })
  //   const datasetTitle = await page.$eval('.dataset-header-title div:first-child', e => e.textContent)
  //   expect(datasetTitle).toBe('NYC Green Taxi Data - June 2020')

  //   // confirm view page is at HEAD
  //   await page.waitForSelector('.commit-details', { visible: true })
  //   const commitHEAD = await page.$eval('.commit-details div:first-child span:first-child', e => e.textContent)
  //   expect(commitHEAD).toBe('HEAD')

  //   // navigate to /history tab
  //   await page.click(`a[href='/${testDatasetRoute1}/history']`)
  //   const pageTitle = await page.$eval('.dataset-content-header-title', e => e.textContent)
  //   expect(pageTitle).toBe('Dataset History')

  //   // navigate to previous commit
  //   await page.click(`a[href='/${testDatasetRoute1}/at/ipfs/QmTfhCr6DUfKZ1CK9f17jhUXqJckwZesrHpj58TY1Y62sV']`)

  //   // confirm view page is at historical commit
  //   await page.waitForSelector('.commit-details', { visible: true })
  //   const commitHistorical = await page.$eval('.commit-details div:first-child span:first-child', e => e.textContent)
  //   expect(commitHistorical).toBe('Y1Y62sV')
  // })

  // it('search for user', async () => {
  //   await page.goto('http://localhost:3000/')
  //   await page.waitForSelector('.search-input', { visible: true })

  //   await page.click('input[name=\'q\']')
  //   await page.type('input[name=\'q\']', testQriUser)
  //   await page.keyboard.press('Enter')

  //   await page.waitForSelector('.filter-header h3')
  //   const searchPageHeader = await page.$eval('.filter-header h3', h3 => h3.textContent)
  //   expect(searchPageHeader).toBe('Dataset Search')
  // })

  // it('file an issue, comment on and close a dataset', async () => {
  //   const issueTitle = 'Issue for Cloud e2e testing'

  //   await signInUserFlow()

  //   await page.goto(`http://localhost:3000/${testDatasetRoute}`)

  //   // navigate to /issues tab
  //   await page.waitForSelector(`a[href='/${testDatasetRoute}/issues']`)
  //   await page.click(`a[href='/${testDatasetRoute}/issues']`)

  //   await page.waitForSelector('a[href=\'issues/new\']', { visible: true })
  //   await page.click('a[href=\'issues/new\']')

  //   await page.waitForSelector('.dataset-content-header-title')
  //   await page.click('input[name=\'title\']')
  //   await page.type('input[name=\'title\']', issueTitle)
  //   await page.click('.CodeMirror textarea')
  //   await page.type('.CodeMirror textarea', 'This is our _special_ issue for e2e testing.')
  //   await page.click(`button[formaction='/${testDatasetRoute}/issues/new']`)

  //   // check that issue is present in list
  //   await page.waitForSelector('.dataset-content-header-title', { visible: true })
  //   const newIssue = await page.$$('.list-item.card')
  //   expect(newIssue).toHaveLength(1)

  //   const newIssueTitle = await page.$eval('.list-item.card .title', issue => issue.textContent)
  //   expect(newIssueTitle).toBe(issueTitle)

  //   // open issue and add comment
  //   await page.click('.list-item.card a')

  //   await page.waitForSelector('.CodeMirror textarea')
  //   await page.click('.CodeMirror textarea')
  //   await page.type('.CodeMirror textarea', 'Here is our test comment')
  //   await page.click('#issue-submit-primary')

  //   // close issue
  //   await page.waitForSelector('#issue-submit-secondary')
  //   await page.click('#issue-submit-secondary')

  //   // expect to see re-open option
  //   await page.waitForSelector('#issue-submit-secondary')
  //   const reopenButton = await page.$$('#issue-submit-secondary')
  //   expect(reopenButton).toHaveLength(1)
  // })

  // it('follow and unfollow a dataset', async () => {
  //   const datasetFollowRoute = `http://localhost:3000/${testDatasetRoute1}/follow`

  //   await signInUserFlow()

  //   await page.goto(`http://localhost:3000/${testDatasetRoute1}`)

  //   // confirm no following status on this dataset
  //   await page.waitForSelector('#followMenu')
  //   let followMenuText = await page.$eval('#followMenu', link => link.textContent)
  //   expect(followMenuText).toBe('Follow')

  //   // follow dataset
  //   await page.click('#followMenu')
  //   await page.waitForSelector(`a[href='${datasetFollowRoute}?status=2']`, { visible: true })
  //   await page.click(`a[href='${datasetFollowRoute}?status=2']`)

  //   // confirm following status
  //   await page.waitForSelector('.alert', { visible: true }) // using alert banner as a proxy for successful load of follow request
  //   followMenuText = await page.$eval('#followMenu', link => link.textContent)
  //   expect(followMenuText).toBe('Unfollow')

  //   // unfollow dataset
  //   await page.click('button[data-dismiss=\'alert\']') // dismiss alert banner
  //   await page.click('#followMenu')
  //   await page.waitForSelector(`a[href='${datasetFollowRoute}?status=0']`, { visible: true })
  //   await page.click(`a[href='${datasetFollowRoute}?status=0']`)

  //   // confirm unfollow status
  //   await page.waitForSelector('.alert', { visible: true }) // using alert banner as a proxy for successful load of unfollow request
  //   followMenuText = await page.$eval('#followMenu', link => link.textContent)
  //   expect(followMenuText).toBe('Follow')
  // })

  // it('download a dataset', async () => {
  //   await signInUserFlow()

  //   await page.goto(`http://localhost:3000/${testDatasetRoute1}`)

  //   await page.waitForSelector('.download-button')
  //   await page.click('.download-button')
  //   await page.waitForSelector('.popover-body #download-full', { visible: true })

  //   const responseCallback = (response: puppeteer.Response) => {
  //     page.off('request', () => {
  //       console.log('Ending request listener.')
  //     })

  //     // test that response comes back with 200
  //     expect(response.status()).toBe(200)
  //   }

  //   page.on('response', (response) => {
  //     responseCallback(response)
  //   })

  //   await page.click('.popover-body #download-full')
  // })