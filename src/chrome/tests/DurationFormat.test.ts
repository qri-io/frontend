import { convertToDuration } from '../DurationFormat'

describe('converToDuration tests', () => {
  test('check zero value', () => {
    expect(convertToDuration(0)).toBe('0m 00s')
  })
  test('check seconds under 10 seconds', () => {
    expect(convertToDuration(9)).toBe('0m 09s')
  })
  test('check one minute', () => {
    expect(convertToDuration(60)).toBe('1m 00s')
  })
  test('check one hour', () => {
    expect(convertToDuration(60 * 60)).toBe('1h 0m 00s')
  })
  test('check one day', () => {
    expect(convertToDuration(60*60*24)).toBe('1d 0h 0m 00s')
  })
  test('check duration with multiple parts', () => {
    expect(convertToDuration((60*60*24)+(60*60)+(60)+1)).toBe('1d 1h 1m 01s')
  })
})