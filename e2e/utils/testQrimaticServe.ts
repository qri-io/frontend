import childProcess, { ChildProcess } from 'child_process'
import fs, { WriteStream } from 'fs'
import os from 'os'
import path from 'path'
import rimraf from 'rimraf'
import sleep from 'sleep-promise'

// TestQrimaticBackend connects to a local Qri backend via Qrimatic.
export default class TestQrimaticBackend {
  private qrimaticBinPath: string
  private process?: ChildProcess | null
  private dir: string
  private stdout?: WriteStream
  private stderr?: WriteStream
  private isProcessRunning: boolean
  private qriPath: string

  constructor() {
    this.qrimaticBinPath = ''
    this.dir = ''
    this.isProcessRunning = false
    this.qriPath = ''
  }

  public async start () {
    this.qriPath = this.setupQriRepo()
    // find qrimatic binary to run
    this.qrimaticBinPath = this.findqrimatic()
    console.log(`Using qrimatic binary found at ${this.qrimaticBinPath}`)
    await this.launchProcess()
  }

  public async close () {
    this.teardownTempLoggingRepo()
    this.teardownQriRepo()
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
          return 'Qrimatic backend process has gracefully exited.'
        })
      }
    }
    const promiseTimeout = async (timeoutMilliseconds: number) => {
      return new Promise((resolve, reject) => {
        return setTimeout(
          () => reject(Error(`Qrimatic backend failed to exit in ${timeoutMilliseconds} milliseconds`)),
          timeoutMilliseconds
        )
      })
    }
    return Promise.race([waitForExit(), promiseTimeout(3000)])
      .then(result => console.log(result))
      .catch(err => console.log(`Error: Qrimatic backend could not gracefully exit: ${err}`))
  }

  private async launchProcess () {
    try {
      this.setUpTempLoggingRepo()

      this.stdout = fs.createWriteStream(path.join(this.dir, 'stdout.log'))
      this.stderr = fs.createWriteStream(path.join(this.dir, 'stderr.log'))

      console.log('backend err log:', path.join(this.dir, 'stderr.log'))
      console.log('launching backend process')

      this.process = childProcess.spawn(`${this.qrimaticBinPath}`, ['serve', '--setup'],
        { 
          env: Object.assign(process.env, {
            'QRI_SETUP_CONFIG_DATA': qriConfig,
            'QRI_PATH': this.qriPath
          })
        }
      )

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

  private setupQriRepo () {
    const base = path.join(os.tmpdir(), 'qri_test_backend')
    console.log("creating test backend repo dir", base)
    fs.mkdirSync(base)

    const qriPath = path.join(base, '.qri')
    fs.mkdirSync(qriPath)

    return qriPath
  }

  private teardownQriRepo () {
    const base = path.dirname(this.qriPath)
    console.log(this.qriPath)
    console.log(base)
    if (base) {
      console.log('removing qri_test_backend dir', base)
      rimraf(base, (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
  }

  private setUpTempLoggingRepo () {
    this.dir = path.join(os.tmpdir(), 'qrimatic_test_backend')
    console.log('creating qrimatic_test_backend dir', this.dir)
    fs.mkdirSync(this.dir)
  }

  private teardownTempLoggingRepo () {
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


const qriConfig = `{
  "Revision": 2,
  "Profile": {
    "id": "QmboGUXqS1hvxKD92RaSCh2G29bDwJqxVmHUVop5ePxqtz",
    "privkey": "CAASqQkwggSlAgEAAoIBAQDGAumEqEOdSX/PIwfoEYq58Idgnx6Y671OnqHNcBkuK3XTw+vSyZduY10O9Ej9m1+5Yc5/twZ1uHPW3B0sY+uSScnD3L4TLMH/gBFU0GWh3AHiTBcvNZA1zlEq9pKAfXMm5EzSI+4mlo6wlKO8NnJ0Qyb9LaAsA/1aBO19VmxWeVndV4ckjrJ7yN8NvgkUxqpnFnqAP3f6sMSe7bcRUA6+3VXl4UPdpraYeI1W1YCdUBjKZ8F4+f0mEIpd++eQB6TtZ46Ve+SsXJEHB/K2eZcOL4KOkeTcAI9Dl9AkSsZsBeHGjWItOB2VH3MRAQH60hy71ZjbhhpxQD1F6m9bG1mPAgMBAAECggEBAIXzBmGVKlhGlk1bl0eoRj5OtmXoflxYbPG4YiCFiqMvB0BAM1GeyfAFC7jIDHBzIShZP8Yp3BbatpJMyPd0iLGndPQoafSyvHHJAvBrIbWDDUs2yiBHjcy4SzRTJPwC4VkX69fkMoCsLM7LXpA+DOMVYlS2/rmH4WV6G+ZEBnnf37UfW7VRX8L9MHwhZOEpJFYlcR0UChpFpA5zzTt+ePqdYZRFklT2Jwol+xlx/EXFbq2wIuHhxFgubiJ3IHKVyh4mSCDyt1wzfQTe9l33TEhQzJcbWidN8blBlXi2jXqSOTJgkCOHe2EC7VuY9T6EKfdJ9vtxv1QRHvjZmFF4HwECgYEAzQUuRAzjOn6z05vNcy0pKoJtsrwJF6SpTOQrH1/ejHO0snKVyISw9uXBuf6KpNmUAqre0GMnv1shyC7PVXFKX2qaqWne16Nx7EjhA2Tm8kGJ0s9HFxLLgLk3aOUYRfAGGm+k1Y0uOR+GYubWnIcHIeBz+N/MXHCi77n9aeIDFU8CgYEA9z+S2Ncs9UFXUG3r6f/JWldICom8FJAwnSKeTvC+VvfYJ4vgGToHnVm8sleO/1YDIaRuwe6KVn7kPGA5xvf1Gv0t+8aOt5qTTiMThp/UKHfliLaSwarnJLIP2NCnKm20HOlwjiwRnP5Ae4S0oR2te1PtU/Ytj0QRXICX46ES58ECgYEAtsJYhNcMNBfAS/FGStbGLJvKGBtg64+gT+fRvQ0kAQYf3Tch6HbInb8gW6HZi6xdMaeKKi9Jvl4Jlj6MGnl8N+R67Gxw9r8/jcdFtlXbPbdImgCmOZ5KhHwXNc2LPsUBW82MHcXVn5xHmqB2TWBc7kj8eK1fqkPKK3MbwKh14ScCgYB2OjYT7kCXPhlsYkOO7zrvMhFGyLng81nrqaQdh0zc9UKtFlugdHkzqrdqaCf+vLhem+xCW7hWx/KHVFQMaoEP2MTmQfn4nbeWg3tQwpiGiV5+0x618Oz6RRMC0DM/PJoFwTKLKVN6yLE43yooaLKN6IHxxiPe/+N1YiA/PsR1gQKBgQDDSk9hHxfffxVT3fuP1tVHHBL6ubP+U3w97jaa3pplnOSN/gxSamxcaVxPeCmCkIxUifPj1WWCHRkUuUOWT2JkqCvR1/kwCOmYBgpvSD7/R97lCPtVvNXueYZQODZPboeTaJwv2Q9y2YcR2PXO62ZyVyUOybtF1UfhZLXksEuvCQ==",
    "peername": "nuun",
    "created": "2019-09-05T16:03:21-04:00",
    "updated": "2019-08-26T13:29:51.130046-04:00",
    "type": "peer",
    "email": "brendan+nuun@qri.io",
    "name": "",
    "description": "",
    "homeurl": "",
    "color": "",
    "thumb": "",
    "photo": "",
    "poster": "",
    "twitter": ""
  },
  "Repo": {
    "type": "fs"
  },
  "Filesystems": [
     { "type": "ipfs" },
     { "type": "local" },
     { "type": "http" }
  ],
  "P2P": {
    "enabled": true,
    "peerid": "QmboGUXqS1hvxKD92RaSCh2G29bDwJqxVmHUVop5ePxqtz",
    "pubkey": "",
    "privkey": "CAASqQkwggSlAgEAAoIBAQDGAumEqEOdSX/PIwfoEYq58Idgnx6Y671OnqHNcBkuK3XTw+vSyZduY10O9Ej9m1+5Yc5/twZ1uHPW3B0sY+uSScnD3L4TLMH/gBFU0GWh3AHiTBcvNZA1zlEq9pKAfXMm5EzSI+4mlo6wlKO8NnJ0Qyb9LaAsA/1aBO19VmxWeVndV4ckjrJ7yN8NvgkUxqpnFnqAP3f6sMSe7bcRUA6+3VXl4UPdpraYeI1W1YCdUBjKZ8F4+f0mEIpd++eQB6TtZ46Ve+SsXJEHB/K2eZcOL4KOkeTcAI9Dl9AkSsZsBeHGjWItOB2VH3MRAQH60hy71ZjbhhpxQD1F6m9bG1mPAgMBAAECggEBAIXzBmGVKlhGlk1bl0eoRj5OtmXoflxYbPG4YiCFiqMvB0BAM1GeyfAFC7jIDHBzIShZP8Yp3BbatpJMyPd0iLGndPQoafSyvHHJAvBrIbWDDUs2yiBHjcy4SzRTJPwC4VkX69fkMoCsLM7LXpA+DOMVYlS2/rmH4WV6G+ZEBnnf37UfW7VRX8L9MHwhZOEpJFYlcR0UChpFpA5zzTt+ePqdYZRFklT2Jwol+xlx/EXFbq2wIuHhxFgubiJ3IHKVyh4mSCDyt1wzfQTe9l33TEhQzJcbWidN8blBlXi2jXqSOTJgkCOHe2EC7VuY9T6EKfdJ9vtxv1QRHvjZmFF4HwECgYEAzQUuRAzjOn6z05vNcy0pKoJtsrwJF6SpTOQrH1/ejHO0snKVyISw9uXBuf6KpNmUAqre0GMnv1shyC7PVXFKX2qaqWne16Nx7EjhA2Tm8kGJ0s9HFxLLgLk3aOUYRfAGGm+k1Y0uOR+GYubWnIcHIeBz+N/MXHCi77n9aeIDFU8CgYEA9z+S2Ncs9UFXUG3r6f/JWldICom8FJAwnSKeTvC+VvfYJ4vgGToHnVm8sleO/1YDIaRuwe6KVn7kPGA5xvf1Gv0t+8aOt5qTTiMThp/UKHfliLaSwarnJLIP2NCnKm20HOlwjiwRnP5Ae4S0oR2te1PtU/Ytj0QRXICX46ES58ECgYEAtsJYhNcMNBfAS/FGStbGLJvKGBtg64+gT+fRvQ0kAQYf3Tch6HbInb8gW6HZi6xdMaeKKi9Jvl4Jlj6MGnl8N+R67Gxw9r8/jcdFtlXbPbdImgCmOZ5KhHwXNc2LPsUBW82MHcXVn5xHmqB2TWBc7kj8eK1fqkPKK3MbwKh14ScCgYB2OjYT7kCXPhlsYkOO7zrvMhFGyLng81nrqaQdh0zc9UKtFlugdHkzqrdqaCf+vLhem+xCW7hWx/KHVFQMaoEP2MTmQfn4nbeWg3tQwpiGiV5+0x618Oz6RRMC0DM/PJoFwTKLKVN6yLE43yooaLKN6IHxxiPe/+N1YiA/PsR1gQKBgQDDSk9hHxfffxVT3fuP1tVHHBL6ubP+U3w97jaa3pplnOSN/gxSamxcaVxPeCmCkIxUifPj1WWCHRkUuUOWT2JkqCvR1/kwCOmYBgpvSD7/R97lCPtVvNXueYZQODZPboeTaJwv2Q9y2YcR2PXO62ZyVyUOybtF1UfhZLXksEuvCQ==",
    "port": 0,
    "addrs": null,
    "qribootstrapaddrs": [
      "/ip4/35.239.80.82/tcp/4001/ipfs/QmdpGkbqDYRPCcwLYnEm8oYGz2G9aUZn9WwPjqvqw3XUAc",
      "/ip4/35.225.152.38/tcp/4001/ipfs/QmTRqTLbKndFC2rp6VzpyApxHCLrFV35setF1DQZaRWPVf",
      "/ip4/35.202.155.225/tcp/4001/ipfs/QmegNYmwHUQFc3v3eemsYUVf3WiSg4RcMrh3hovA5LncJ2",
      "/ip4/35.238.10.180/tcp/4001/ipfs/QmessbA6uGLJ7HTwbUJ2niE49WbdPfzi27tdYXdAaGRB4G",
      "/ip4/35.238.105.35/tcp/4001/ipfs/Qmc353gHY5Wx5iHKHPYj3QDqHP4hVA1MpoSsT6hwSyVx3r",
      "/ip4/35.239.138.186/tcp/4001/ipfs/QmT9YHJF2YkysLqWhhiVTL5526VFtavic3bVueF9rCsjVi",
      "/ip4/35.226.44.58/tcp/4001/ipfs/QmQS2ryqZrjJtPKDy9VTkdPwdUSpTi1TdpGUaqAVwfxcNh"
    ],
    "httpgatewayaddr": "https://ipfs.io",
    "profilereplication": "full",
    "bootstrapaddrs": null,
    "autoNAT": false
  },
  "Registry": {
    "location": "http://localhost:2500"
  },
  "Remotes": null,
  "Remote": null,
  "CLI": {
    "colorizeoutput": true
  },
  "API": {
    "enabled": true,
    "address": "/ip4/127.0.0.1/tcp/2503",
    "readonly": false,
    "remotemode": false,
    "remoteacceptsizemax": 0,
    "remoteaccepttimeoutms": 0,
    "urlroot": "",
    "tls": false,
    "proxyforcehttps": false,
    "allowedorigins": [
      "electron://local.qri.io",
      "http://localhost:2505",
      "http://localhost:3000",
      "http://app.qri.io",
      "https://app.qri.io"
    ],
    "serveremotetraffic": true
  },
  "RPC": {
    "enabled": true,
    "address":  "/ip4/127.0.0.1/tcp/2504"
  },
  "Logging": {
    "levels": {
      "lib": "debug",
      "qriapi": "info",
      "qrip2p": "info",
      "remote": "info"
    }
  }
}`
