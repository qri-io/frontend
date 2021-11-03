export function platform (): 'mac' | 'pc' {
  if (navigator.platform.includes('Mac')) {
    return 'mac'
  }
  return 'pc'
}
