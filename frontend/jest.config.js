module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^app/(.*)$": "<rootDir>/src/app/$1",
    "^assets/(.*)$": "<rootDir>/src/assets/$1",
    "^environments/(.*)$": "<rootDir>/src/environments/$1",
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.d.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
  ],
  coverageReporters: ["text", "lcov", "html"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!.*\\.mjs$)",
    "node_modules/(?!@angular|@angular-devkit|@angular/cli|@angular/common|@angular/compiler|@angular/core|@angular/forms|@angular/platform-browser|@angular/router|@angular/cdk|chart.js|rxjs|zone.js)",
  ],
  moduleFileExtensions: ["ts", "js", "html"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.ts",
    "<rootDir>/src/**/?(*.)+(spec|test).ts",
  ],
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.html$",
      },
    ],
  },
};
