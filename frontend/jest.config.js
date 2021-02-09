module.exports = {
  roots: [
    "<rootDir>/src",
    // "<rootDir>/test",
    "<rootDir>/e2e"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  maxWorkers: 3
}