import type { Config } from 'jest'
import { createDefaultPreset } from 'ts-jest'

const tsJestPreset = createDefaultPreset()

const config: Config = {
    testEnvironment: 'node',
    transform: {
        ...tsJestPreset.transform,
    },
}

export default config
