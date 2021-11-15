export function runEndTime (runStart: string | Date, runDuration: number): Date {
  let runStartTime = new Date()
  if (typeof runStart === 'string') {
    runStartTime = new Date(runStart)
  } else {
    runStartTime = runStart
  }
  if (!runDuration) { runDuration = 0 }
  return new Date(runStartTime.getTime() + (runDuration / 1000000))
}
