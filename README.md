[![Qri](https://img.shields.io/badge/made%20by-qri-magenta.svg?style=flat-square)](https://qri.io) [![License](https://img.shields.io/github/license/qri-io/desktop.svg?style=flat-square)](./LICENSE)

<h1 align="center">Qrimatic</h1>

<div align="center">
  <img alt="logo" src="https://user-images.githubusercontent.com/1833820/121702439-df4e6600-ca9f-11eb-8143-028305884dbc.png" width="128">
</div>
<div align="center">
  <p>react, redux, typescript web application</p>
  <strong>Qrimatic is our new cloud platform for keeping data fresh, shareable, discoverable, and usable.</strong>
</div>

<div align="center">
  <h3>
    <a href="https://qri.io">
      Qri Website
    </a>
    <span> | </span>
    <a href="#running">
      Run in Dev Mode
    </a>
    <span> | </span>
    <a href="#e2e-tests">
      Run e2e tests
    </a>
    <span> | </span>
    <a href="#dependencies">
      Dependencies
    </a>
    <span> | </span>
    <a href="https://github.com/qri-io/frontend/CONTRIBUTOR.md">
      Contribute
    </a>
    <span> | </span>
    <a href="https://github.com/qri-io/frontend/issues">
      Issues
    </a>
     <span> | </span>
    <a href="https://qri.io/docs/">
      Docs
    </a>
  </h3>
</div>

## Welcome

| Question | Answer |
|--------|-------|
| "I want to learn about Qri" | [Read the official documentation](https://qri.io/docs/) |
| "I want to run Qrimatic in a development environment" | [Running Qrimatic for dev](https://github.com/qri-io/qrimatic/README.md#running) |
| "I want to run the Qrimatic e2e tests" | [Run e2e tests](https://github.com/qri-io/qrimatic/README.md#e2e-tests) |
| "I have a question" | [Create an issue](https://github.com/qri-io/qrimatic/issues) and use the label 'question' |
| "I found a bug" | [Create an issue](https://github.com/qri-io/qrimatic/issues) and use the label 'bug' |
| "I want to help build the Qrimatic" | [Read the Contributing guides](https://github.com/qri-io/qrimatic/CONTRIBUTOR.md) |

<a id="running"></a>
## Run Qrimatic in developer mode

We use yarn to build and manage Qrimatic.  The frontend app needs an API to talk to.  You can use the live staging API or set up a local proxy and run the app with the environment variable `REACT_APP_API_BASE_URL` defined

After you have cloned this repository, install dependencies:

`yarn`

Run the development server:

`yarn start`

<a id="e2e-tests"></a>
## run the e2e tests

### run locally
To run the e2e tests locally, you must be able to run and instance of qri & an instance of the frontend app

1) launch the frontend app (`yarn start`)
2) in your local qri config, add "http:localhost:3000" to your `API.allowedOrigins`
3) in another terminal, launch the qri app (`qri connect`)
4) set your credentials as environment variables:
`TEST_E2E_USERNAME` is your local qri node's username
`TEST_E2E_PASSWORD` is your password
5) run `yarn e2e-test` to run your tests

### run via cloud
To run the e2e tests via the staging cloud environment you must have an accound on `rosebud.qri.cloud` that has been cleared by an administrator. For help, please reach out to us on discord.

1) set your credentials as environment variables:
`TEST_E2E_USERNAME` is your qri cloud username
`TEST_E2E_PASSWORD` is your password
2) set your app url environment variable:
`TEST_E2E_APP_URL="https://rosebud.qri.cloud"`
3) run `yarn e2e-test`

<a id="dependencies"></a>
## Main Dependencies

| Dependency | Website | Github |
|------|------|------|
| Qri Backend | https://qri.io/ | https://github.com/qri-io/qri/ |
| React | https://reactjs.org/ | https://github.com/facebook/react/ |
| Redux | https://redux.js.org/ | https://github.com/reduxjs/redux |


## LICENSE

[GPL-3.0](https://github.com/qri-io/desktop/blob/master/LICENSE)

## Contribute

We've set up a separate document for our [contributor guidelines](https://github.com/qri-io/qrimatic/blob/master/CONTRIBUTOR.md)!


###### This documentation has been adapted from the [Data Together](https://github.com/datatogether/datatogether), [Hyper](https://github.com/zeit/hyper), [AngularJS](https://github.com/angular/angularJS), and [Cycle.js](https://github.com/cyclejs/cyclejs) documentation.
