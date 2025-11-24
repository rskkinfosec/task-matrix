/**
 * Test Runner for TaskMatrix PWA
 * Executes all test suites and provides summary results
 */

const fs = require('fs');
const path = require('path');

class TestRunner {
    constructor() {
        this.testSuites = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.testResults = [];
    }

    registerSuite(suiteName, testFunctions) {
        this.testSuites.push({ name: suiteName, tests: testFunctions });
    }

    async runAllTests() {
        console.log('\n' + '='.repeat(80));
        console.log('🧪 TASKMATRIX TEST SUITE');
        console.log('='.repeat(80) + '\n');

        for (const suite of this.testSuites) {
            await this.runSuite(suite);
        }

        this.printSummary();
    }

    async runSuite(suite) {
        console.log(`\n📋 Test Suite: ${suite.name}`);
        console.log('-'.repeat(80));

        for (const [testName, testFn] of Object.entries(suite.tests)) {
            try {
                await testFn();
                this.passedTests++;
                this.testResults.push({ suite: suite.name, test: testName, status: '✅ PASSED' });
                console.log(`  ✅ ${testName}`);
            } catch (error) {
                this.failedTests++;
                this.testResults.push({ 
                    suite: suite.name, 
                    test: testName, 
                    status: '❌ FAILED',
                    error: error.message 
                });
                console.log(`  ❌ ${testName}`);
                console.log(`     Error: ${error.message}`);
            }
            this.totalTests++;
        }
    }

    printSummary() {
        const passRate = this.totalTests > 0 ? ((this.passedTests / this.totalTests) * 100).toFixed(2) : 0;
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(80));
        console.log(`Total Tests:    ${this.totalTests}`);
        console.log(`Passed:         ${this.passedTests} ✅`);
        console.log(`Failed:         ${this.failedTests} ❌`);
        console.log(`Pass Rate:      ${passRate}%`);
        console.log('='.repeat(80) + '\n');

        if (this.failedTests > 0) {
            console.log('❌ FAILED TESTS:');
            this.testResults
                .filter(r => r.status.includes('FAILED'))
                .forEach(r => {
                    console.log(`  - [${r.suite}] ${r.test}`);
                    if (r.error) console.log(`    ${r.error}`);
                });
            console.log();
        }

        process.exit(this.failedTests > 0 ? 1 : 0);
    }
}

module.exports = TestRunner;
