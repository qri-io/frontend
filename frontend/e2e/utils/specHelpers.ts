import fetch from 'node-fetch'
import sleep from 'sleep-promise'
import TestQrimaticBackend from './testQrimaticServe'
import TestQrimaticFrontend from './testFrontendServe'

const FRONTEND_URL_BASE = process.env.FRONTEND_URL_BASE || 'http://localhost:3000'
const BACKEND_URL_BASE = process.env.BACKEND_URL_BASE || 'http://localhost:3002'

const confirmServiceIsLive = async (url: string) => {
  let backoffMilliseconds = 1000
  let connectionError = ''
  while (backoffMilliseconds < 60000) {
    try {
      const result = await fetch(url)
      if (result.status === 200) {
        console.log(`Successfully connected to ${url}`)
        return
      }
    } catch (err) {
      connectionError = err
    }

    await sleep(backoffMilliseconds)
    backoffMilliseconds *= 2
  }
  throw new Error(`Failed on final attempt to connect to ${url}: ${connectionError}`)
}

const readinessCheck = async (url: string) => {
  try {
    await confirmServiceIsLive(url)
  } catch (err) {
    console.log(`Error in health check: ${err}`)
  }
}

export const startupBackendApp = async () => {
  let backend =  new TestQrimaticBackend()
  try {
    await backend.start()
    await readinessCheck(BACKEND_URL_BASE)
    return backend
  } catch (err) {
    console.log(`Error attempting to connect to cloud backend: ${err}`)
    return backend
  }
}

export const startUpFrontendApp = async () => {
  let frontend = new TestQrimaticFrontend()
  try {
    await readinessCheck(FRONTEND_URL_BASE)
  } catch (err) {
    console.log(`Error attempting to connect to cloud frontend: ${err}`)
  }
  return frontend
}
