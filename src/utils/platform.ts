export function platform(): 'mac' | 'pc' {
  if (navigator.platform.indexOf('Mac') > -1) {
    return 'mac'
  }
  return 'pc'
}
