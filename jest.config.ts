/* eslint-disable */
import type { Config } from 'jest';

const config: Config = {
    displayName: "temporal-beacon",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
            }
        }],
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.test.ts",
        "!src/client/**/*",
    ],
    coverageDirectory: "./coverage",
    coverageReporters: ["text", "lcov", "html"],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};

export default config;
