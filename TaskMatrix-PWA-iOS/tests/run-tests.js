#!/usr/bin/env node

/**
 * Main Test Runner
 * Aggregates all test suites and runs them with summary report
 */

const TestRunner = require('./test-runner');
const { getTests: getTaskTests } = require('./task-operations.test');
const { getTests: getTabTests } = require('./tab-management.test');
const { getTests: getSyncTests } = require('./sync-merge.test');
const { getTests: getPersistenceTests } = require('./persistence.test');

async function main() {
    const runner = new TestRunner();

    // Register all test suites
    runner.registerSuite('Task Operations', getTaskTests());
    runner.registerSuite('Tab Management', getTabTests());
    runner.registerSuite('Sync & Merge', getSyncTests());
    runner.registerSuite('Persistence & State', getPersistenceTests());

    // Run all tests
    await runner.runAllTests();
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
