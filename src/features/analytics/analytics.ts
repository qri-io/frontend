export function trackGoal(id: string, cents: number): void {
  window?.fathom?.trackGoal(id, cents)
}