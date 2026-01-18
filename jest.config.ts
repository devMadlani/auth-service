import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const tsJestPreset = createDefaultPreset()

const config: Config = {
    testEnvironment: 'node',
    transform: {
        ...tsJestPreset.transform,
    },
    verbose: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!src/node_modules/**'],
}

export default config
