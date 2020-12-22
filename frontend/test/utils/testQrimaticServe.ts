import childProcess, { ChildProcess } from 'child_process'
import fs, { WriteStream } from 'fs'
import os from 'os'
import path from 'path'
import rimraf from 'rimraf'
import sleep from 'sleep-promise'

// TestQrimaticBackend connects to a local Cloud backend via qrimatic.
export default class TestQrimaticBackend {
  private qrimaticBinPath: string
  private process?: ChildProcess | null
  private dir: string
  private stdout?: WriteStream
  private stderr?: WriteStream
  private isProcessRunning: boolean

  constructor() {
    this.qrimaticBinPath = ''
    this.dir = ''
    this.isProcessRunning = false
  }

  public async start () {
    // find qrimatic binary to run
    this.qrimaticBinPath = this.findqrimatic()
    console.log(`Using qrimatic binary found at ${this.qrimaticBinPath}`)
    await this.launchProcess()
  }

  public async close () {
    this.tearDownTempLoggingRepo()
    if (this.process) {
      // qrimatic is expecting the interrupt signal
      this.process.kill('SIGINT')
    }
    await this.gracefullyExit()
  }

  private async gracefullyExit () {
    const waitForExit = async () => {
      if (this.isProcessRunning) {
        return sleep(100).then(() => {
          if (this.isProcessRunning) {
            waitForExit()
          }
          return 'Cloud backend process has gracefully exited.'
        })
      }
    }
    const promiseTimeout = async (timeoutMilliseconds: number) => {
      return new Promise((resolve, reject) => {
        return setTimeout(
          () => reject(Error(`Cloud backend failed to exit in ${timeoutMilliseconds} milliseconds`)),
          timeoutMilliseconds
        )
      })
    }
    return Promise.race([waitForExit(), promiseTimeout(3000)])
      .then(result => console.log(result))
      .catch(err => console.log(`Error: Cloud backend could not gracefully exit: ${err}`))
  }

  private async launchProcess () {
    try {
      this.setUpTempLoggingRepo()

      this.stdout = fs.createWriteStream(path.join(this.dir, 'stdout.log'))
      this.stderr = fs.createWriteStream(path.join(this.dir, 'stderr.log'))

      console.log('backend err log:', path.join(this.dir, 'stderr.log'))
      console.log('launching backend process')

      this.process = childProcess.spawn(`${this.qrimaticBinPath}`, ['serve'])

      if (this.process.stdout) {
        this.process.stdout.pipe(this.stdout)
      }
      if (this.process.stderr) {
        this.process.stderr.pipe(this.stderr)
      }

      this.process.on('error', (err: any) => { this.handleEvent('error', err) })
      this.process.on('exit', (err: any) => {
        this.handleEvent('exit', err)
        console.log('setting is process running false')
        this.isProcessRunning = false
      })
      this.process.on('disconnect', (err: any) => {
        this.handleEvent('disconnect', err)
        this.process = null
      })
      this.isProcessRunning = true
    } catch (err) {
      this.handleEvent('error', err)
      this.close()
    }
  }

  private findqrimatic () {
    const { stdout = '' } = childProcess.spawnSync('which', ['qrimatic'])
    let filename = stdout.toString().trim()
    if (fs.existsSync(filename)) {
      return filename
    }
    // In Win32, end the binary with .exe extension.
    filename += '.exe'
    if (fs.existsSync(filename)) {
      return filename
    }
    // In Win32, certain shells need to use Windows-style mount points, instead of cygwin-style.
    filename = filename.replace('/c/', 'c:/')
    if (fs.existsSync(filename)) {
      return filename
    }
    throw new Error(`Could not find qrimatic binary`)
  }

  private setUpTempLoggingRepo () {
    this.dir = path.join(os.tmpdir(), 'qrimatic_test_backend')
    console.log('creating qrimatic_test_backend dir', this.dir)
    fs.mkdirSync(this.dir)
  }

  private tearDownTempLoggingRepo () {
    if (this.dir) {
      console.log('removing qrimatic_test_backend dir')
      rimraf(this.dir, (err) => {
        if (err) {
          console.log(err)
        }
      })
      this.dir = ''
    }
  }

  private handleEvent (type: string, err: Error) {
    if (err) {
      console.log(`test backend: err event '${type}' from backend: ${err}`)
    } else {
      console.log(`test backend: event '${type}' from backend`)
    }
  }
}
