/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',

    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],

    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!tests/**',
        '!**/node_modules/**',
    ],
}
