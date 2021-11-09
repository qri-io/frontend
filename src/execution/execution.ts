export enum ExecutionMode {
  // LOCAL represents running the app as a browser application running locally
  LOCAL = "LOCAL",
  // CLOUD represents running the app as a browser application running in the cloud
  CLOUD = "CLOUD",
  // DESKTOP represents running the app as an electron application running locally
  DESKTOP = "DESKTOP"
}

export function getAppExecMode (mode: string): ExecutionMode {
  mode = mode.toUpperCase()
  switch (mode) {
    case "LOCAL":
      return ExecutionMode.LOCAL
    case "CLOUD":
      return ExecutionMode.CLOUD
    case "DESKTOP":
      return ExecutionMode.DESKTOP
    default:
      return ExecutionMode.LOCAL
  }
}
