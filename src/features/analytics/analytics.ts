// eslint-disable-next-line
declare global {
  // eslint-disable-next-line
  interface Window {
    fathom: any
  }
}

window.fathom = window.fathom || {}

export function trackGoal (id: string, cents: number): void {
  if (window?.fathom?.trackGoal) {
    window?.fathom?.trackGoal(id, cents)
  }
}
