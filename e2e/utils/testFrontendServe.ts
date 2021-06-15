import childProcess, { ChildProcess } from 'child_process'

// TestQrimaticFrontend connects lauches the frontend application
// and gives methods for properly closing the frontend process
export default class TestQrimaticFrontend {
  private frontend?: ChildProcess

  constructor () {
    this.frontend = childProcess.spawn('yarn', ['start'], 
    {
      detached: true, 
      env: { ...process.env, "BROWSER": "none" }
    })
  }

  public async close () {
    if (this.frontend) {
      process.kill(-this.frontend.pid)
      console.log('Qrimatic frontend process has gracefully exited')
    }
  }
}
