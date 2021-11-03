export function timestampIsZero (t: string | Date): boolean {
  // '0001-01-01 00:00:00 +0000 UTC' is the stringified "zero" time in golang
  // '0001-01-01T00:00:00.000Z' is the stringified "zero" time using JSON.stringify
  return t === '0001-01-01 00:00:00 +0000 UTC' || t === '0001-01-01T00:00:00.000Z' || JSON.stringify(t) === '"0001-01-01T00:00:00.000Z"'
}
