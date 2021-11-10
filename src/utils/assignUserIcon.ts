// as a quick fix to have consistent icons for every place we show a username,
// we will just use a fixed set of blob icons and a deterministic way to assign
// an icon based on the username
export default function assignUserIcon (username: string): string {
  // very simple hash
  // from https://stackoverflow.com/questions/17083316/hashing-a-string-between-two-integers-with-a-good-distribution-uniform-hash
  function hashStr (str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i)
      hash += charCode
    }
    return hash
  }

  const icons = [
    'darkgreen',
    'green',
    'navy',
    'orange',
    'pink',
    'sand',
    'tile'
  ]

  const hash = hashStr(username)
  const index = hash % icons.length

  return `/img/user-icons/${icons[index]}.png`
}
