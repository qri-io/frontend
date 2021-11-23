// derive the possessive version of a username
// from https://github.com/batusai513/possessive/blob/master/index.js
const APOSTROPHE_CHAR = '’'

export default function possessive (str: string) {
  if (str === '') {
    return str
  }
  let lastChar = str.slice(-1)
  let endOfWord = lastChar.toLowerCase() === 's' ? APOSTROPHE_CHAR : `${APOSTROPHE_CHAR}s`
  return `${str}${endOfWord}`
}
