/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',

    // 👉 NEW WAY (not globals)
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
                useESM: false,
            },
        ],
    },

    // 👉 THIS FIXES YOUR MODULE NOT FOUND
    moduleDirectories: ['node_modules', 'src'],

    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',

    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!tests/**',
        '!**/node_modules/**',
    ],
}
