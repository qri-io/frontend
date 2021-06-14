export default function commitishFromPath (path: string): string {
  return path.split('/')[2].substr(0,8)
}
