# Cloud e2e Testing

We are using jest as our test runner for Cloud e2e tests paired with puppeteer for browser interactivity.

To get the test suite running, run `yarn test-e2e` which will first build the app and then launch the test suite. If you already have a built app to run tests against, you can use the secondary `yarn test-e2e-no-build` command.

The suite uses devproxy to port forward the Cloud backend and autostarts via the `test-e2e` scripts.

When debugging, it is often helpful to slow the tests down and visually identify a bug. To do so, add the `slowMo` key to the `puppeteer.launch` options arg in the jest `beforeEach` call. An example of this is:

```
browser = await puppeteer.launch({
    headless,
    slowMo: 270
})
```