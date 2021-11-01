export function runEndTime(runStart: string, runDuration: number): Date {
  const runStartTime = new Date(runStart)
  if (!runDuration) { runDuration = 0 }
  return new Date(runStartTime.getTime() + (runDuration / 1000000))
}