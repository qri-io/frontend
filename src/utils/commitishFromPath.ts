export default function commitishFromPath (path: string): string {
  if (path) {
    return path.split('/')[2].substr(0, 8)
  }
  return "unknown"
}
