#!/usr/bin/env node

/**
 * Sync Scenarios Test Runner
 * Executes all sync scenario tests and provides detailed reporting
 */

const { SyncStateManager } = require('./test-sync-scenarios.js');
const assert = require('assert');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureDetails = [];

function test(testName, testFn) {
    totalTests++;
    try {
        testFn();
        passedTests++;
        console.log(`  ✅ ${testName}`);
    } catch (error) {
        failedTests++;
        failureDetails.push({ testName, error: error.message });
        console.log(`  ❌ ${testName}`);
        console.log(`     Error: ${error.message}`);
    }
}

function describe(suiteName, suiteFn) {
    console.log(`\n📋 ${suiteName}`);
    suiteFn();
}

function beforeEach(fn) {
    // Store for use in tests (simplified)
    global.beforeEachFn = fn;
}

// Override test function to call beforeEach
const originalTest = test;
function test(testName, testFn) {
    totalTests++;
    try {
        if (global.beforeEachFn) global.beforeEachFn();
        testFn();
        passedTests++;
        console.log(`  ✅ ${testName}`);
    } catch (error) {
        failedTests++;
        failureDetails.push({ testName, error: error.message });
        console.log(`  ❌ ${testName}`);
        console.log(`     Error: ${error.message}`);
    }
}

// Test Suite 1: Single Device Repeated Syncs
describe('Single Device - Repeated Syncs', () => {
    let device;

    test('SC-1.1: Single sync after adding task', () => {
        device = new SyncStateManager('Device-A');
        device.addTask('Task 1', 'First task');
        const syncResult = device.sync();
        assert.strictEqual(syncResult.syncedTasks.length, 1, 'Should sync 1 task');
        assert.strictEqual(device.getTasksSyncState().synced, 1, 'Should have 1 synced task');
    });

    test('SC-1.2: Multiple syncs with new tasks added between syncs', () => {
        device = new SyncStateManager('Device-A');
        device.addTask('Task 1');
        const sync1 = device.sync();
        assert.strictEqual(sync1.syncedTasks.length, 1);

        device.addTask('Task 2');
        device.addTask('Task 3');
        const sync2 = device.sync();
        assert.strictEqual(sync2.syncedTasks.length, 3, 'Should sync all 3 tasks');
    });

    test('SC-1.3: Multiple syncs with updates between syncs', () => {
        device = new SyncStateManager('Device-A');
        const task1 = device.addTask('Task 1', 'Original');
        device.sync();

        device.updateTask(task1.id, { description: 'Updated' });
        const sync2 = device.sync();
        
        assert.strictEqual(sync2.syncedTasks.length, 1);
        const syncedTask = device.tasks.find(t => t.id === task1.id);
        assert.strictEqual(syncedTask.description, 'Updated');
    });

    test('SC-1.4: Three consecutive syncs with mixed operations', () => {
        device = new SyncStateManager('Device-A');
        const t1 = device.addTask('Task 1');
        const t2 = device.addTask('Task 2');
        const sync1 = device.sync();
        assert.strictEqual(sync1.syncedTasks.length, 2);

        device.updateTask(t1.id, { description: 'Modified' });
        const t3 = device.addTask('Task 3');
        const sync2 = device.sync();
        assert.strictEqual(sync2.syncedTasks.length, 3);

        device.deleteTask(t2.id);
        const t4 = device.addTask('Task 4');
        const sync3 = device.sync();
        assert.strictEqual(sync3.syncedTasks.length, 3, 'Should sync non-deleted tasks');

        const state = device.getTasksSyncState();
        assert.strictEqual(state.deleted, 1);
        assert.strictEqual(state.synced, 3);
    });

    test('SC-1.5: Rapid consecutive syncs (no changes between syncs)', () => {
        device = new SyncStateManager('Device-A');
        const task = device.addTask('Task 1');
        const sync1 = device.sync();
        const sync2 = device.sync();
        const sync3 = device.sync();

        assert.strictEqual(sync1.syncedTasks.length, 1);
        assert.strictEqual(sync2.syncedTasks.length, 1, 'Should still sync even if no changes');
        assert.strictEqual(sync3.syncedTasks.length, 1);
        assert.strictEqual(device.syncHistory.length, 3);
    });

    test('SC-1.6: Sync history tracks all operations correctly', () => {
        device = new SyncStateManager('Device-A');
        device.addTask('Task 1');
        device.sync();
        device.addTask('Task 2');
        device.sync();
        device.addTask('Task 3');
        device.sync();

        const history = device.getSyncHistory();
        assert.strictEqual(history.length, 3, 'Should have 3 sync records');
        assert.strictEqual(history[0].localTaskCount, 1);
        assert.strictEqual(history[1].localTaskCount, 2);
        assert.strictEqual(history[2].localTaskCount, 3);
    });
});

// Test Suite 2: Two Device Interleaved Syncs
describe('Two Devices - Interleaved Syncs', () => {
    let deviceA, deviceB;

    test('SC-2.1: Device A syncs, Device B syncs independently', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');

        deviceA.addTask('Task A1');
        const syncA1 = deviceA.sync();
        assert.strictEqual(syncA1.syncedTasks.length, 1);

        deviceB.addTask('Task B1');
        const syncB1 = deviceB.sync();
        assert.strictEqual(syncB1.syncedTasks.length, 1);

        assert.strictEqual(deviceA.tasks.length, 1);
        assert.strictEqual(deviceB.tasks.length, 1);
    });

    test('SC-2.2: Device A syncs, B syncs, merge B into A', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');

        const taskA = deviceA.addTask('Task A1');
        deviceA.sync();

        const taskB = deviceB.addTask('Task B1');
        deviceB.sync();

        const stateB = { tasks: deviceB.tasks };
        deviceA.mergeRemoteState(stateB);

        assert.strictEqual(deviceA.tasks.length, 2, 'Device A should have tasks from both devices');
        const guids = deviceA.tasks.map(t => t.guid);
        assert(guids.includes(taskA.guid));
        assert(guids.includes(taskB.guid));
    });

    test('SC-2.3: Interleaved syncs - A adds, B adds, merge, A syncs, B syncs', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');

        const taskA1 = deviceA.addTask('Task A1');
        deviceA.sync();

        const taskB1 = deviceB.addTask('Task B1');
        deviceB.sync();

        deviceA.mergeRemoteState({ tasks: deviceB.tasks });
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });

        assert.strictEqual(deviceA.tasks.length, 2);
        assert.strictEqual(deviceB.tasks.length, 2);

        const syncA2 = deviceA.sync();
        const syncB2 = deviceB.sync();

        assert.strictEqual(syncA2.syncedTasks.length, 2);
        assert.strictEqual(syncB2.syncedTasks.length, 2);
    });

    test('SC-2.4: Conflict resolution - both devices update same task', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');

        const task = deviceA.addTask('Shared Task');
        deviceA.sync();
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });

        deviceA.updateTask(task.id, { description: 'Update from A' });
        
        const taskInB = deviceB.tasks.find(t => t.guid === task.guid);
        const laterTime = new Date(Date.now() + 1000).toISOString();
        taskInB.updatedAt = laterTime;
        taskInB.description = 'Update from B';

        deviceA.sync();
        deviceB.sync();
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });

        const finalTask = deviceB.tasks.find(t => t.guid === task.guid);
        assert.strictEqual(finalTask.description, 'Update from B');
    });

    test('SC-2.5: Three syncs each, alternating order', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');

        deviceA.addTask('A-Task-1');
        deviceA.sync();

        deviceB.addTask('B-Task-1');
        deviceB.sync();

        deviceA.addTask('A-Task-2');
        deviceA.sync();

        deviceB.addTask('B-Task-2');
        deviceB.sync();

        deviceA.mergeRemoteState({ tasks: deviceB.tasks });
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });

        deviceA.sync();
        deviceB.sync();

        assert.strictEqual(deviceA.syncHistory.length, 3);
        assert.strictEqual(deviceB.syncHistory.length, 3);
        assert.strictEqual(deviceA.tasks.length, 4);
        assert.strictEqual(deviceB.tasks.length, 4);
    });
});

// Test Suite 3: Three Device Interleaved Syncs
describe('Three Devices - Interleaved Syncs', () => {
    let deviceA, deviceB, deviceC;

    test('SC-3.1: A syncs, B syncs, C syncs, all merge pairwise', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');
        deviceC = new SyncStateManager('Device-C');

        deviceA.addTask('A-Task');
        deviceA.sync();

        deviceB.addTask('B-Task');
        deviceB.sync();

        deviceC.addTask('C-Task');
        deviceC.sync();

        deviceA.mergeRemoteState({ tasks: deviceB.tasks });
        deviceA.mergeRemoteState({ tasks: deviceC.tasks });
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });
        deviceB.mergeRemoteState({ tasks: deviceC.tasks });
        deviceC.mergeRemoteState({ tasks: deviceA.tasks });
        deviceC.mergeRemoteState({ tasks: deviceB.tasks });

        assert.strictEqual(deviceA.tasks.length, 3);
        assert.strictEqual(deviceB.tasks.length, 3);
        assert.strictEqual(deviceC.tasks.length, 3);
    });

    test('SC-3.2: Complex interleaved syncs - A-B-C-A-B-C pattern', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');
        deviceC = new SyncStateManager('Device-C');

        deviceA.addTask('A1');
        deviceA.sync();

        deviceB.addTask('B1');
        deviceB.sync();

        deviceC.addTask('C1');
        deviceC.sync();

        deviceA.mergeRemoteState({ tasks: deviceB.tasks });
        deviceB.mergeRemoteState({ tasks: deviceC.tasks });
        deviceC.mergeRemoteState({ tasks: deviceA.tasks });

        deviceA.addTask('A2');
        deviceA.sync();

        deviceB.addTask('B2');
        deviceB.sync();

        deviceC.addTask('C2');
        deviceC.sync();

        deviceA.mergeRemoteState({ tasks: deviceB.tasks });
        deviceA.mergeRemoteState({ tasks: deviceC.tasks });
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });
        deviceB.mergeRemoteState({ tasks: deviceC.tasks });
        deviceC.mergeRemoteState({ tasks: deviceA.tasks });
        deviceC.mergeRemoteState({ tasks: deviceB.tasks });

        assert.strictEqual(deviceA.tasks.length, 6);
        assert.strictEqual(deviceB.tasks.length, 6);
        assert.strictEqual(deviceC.tasks.length, 6);
    });

    test('SC-3.3: Sequential operations across 3 devices with multiple syncs', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');
        deviceC = new SyncStateManager('Device-C');

        const devices = [deviceA, deviceB, deviceC];

        devices.forEach((device, idx) => {
            for (let i = 0; i < 2; i++) {
                device.addTask(`Task-${idx}-${i}`);
            }
            device.sync();
        });

        devices.forEach(d => {
            devices.forEach(other => {
                if (d !== other) d.mergeRemoteState({ tasks: other.tasks });
            });
        });

        devices.forEach(d => {
            assert.strictEqual(d.tasks.length, 6, `Device should have all 6 tasks`);
        });
    });

    test('SC-3.4: Delete operations across 3 devices', () => {
        deviceA = new SyncStateManager('Device-A');
        deviceB = new SyncStateManager('Device-B');
        deviceC = new SyncStateManager('Device-C');

        const taskA = deviceA.addTask('SharedTask');
        deviceA.sync();
        deviceB.mergeRemoteState({ tasks: deviceA.tasks });
        deviceC.mergeRemoteState({ tasks: deviceA.tasks });

        const taskGUID = taskA.guid;

        deviceA.deleteTask(taskA.id);
        deviceA.sync();

        deviceB.mergeRemoteState({ tasks: deviceA.tasks });
        deviceC.mergeRemoteState({ tasks: deviceA.tasks });

        const taskInB = deviceB.tasks.find(t => t.guid === taskGUID);
        const taskInC = deviceC.tasks.find(t => t.guid === taskGUID);

        assert.strictEqual(taskInB.syncState, 'Deleted');
        assert.strictEqual(taskInC.syncState, 'Deleted');
    });
});

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY - SYNC SCENARIOS');
console.log('='.repeat(60));
console.log(`Total Test Cases:  ${totalTests}`);
console.log(`✅ Passed:         ${passedTests}`);
console.log(`❌ Failed:         ${failedTests}`);
console.log(`Success Rate:      ${((passedTests / totalTests) * 100).toFixed(2)}%`);
console.log('='.repeat(60));

if (failureDetails.length > 0) {
    console.log('\n⚠️  FAILURE DETAILS:\n');
    failureDetails.forEach((detail, idx) => {
        console.log(`${idx + 1}. ${detail.testName}`);
        console.log(`   ${detail.error}\n`);
    });
}

console.log('\n');
process.exit(failedTests === 0 ? 0 : 1);
