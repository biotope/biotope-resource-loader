module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.module.json'
    }
  }
};
