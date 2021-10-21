export function runEndTime(runStart: string, runDuration: number): Date {
  const runStartTime = new Date(runStart)
  return new Date(runStartTime.getTime() + (runDuration / 1000000))
}