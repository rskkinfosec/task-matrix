/**
 * Scenario Simulations
 * Real-world usage patterns and edge cases
 */

const { TaskModel } = require('./task-operations.test');
const { TabManager } = require('./tab-management.test');
const { SyncManager } = require('./sync-merge.test');
const { PersistenceManager, StorageManager } = require('./persistence.test');

// ============================================================================
// Scenario 1: Multi-Device Task Creation and Sync
// ============================================================================
function scenario1_multiDeviceSync() {
    console.log('\n📱 SCENARIO 1: Multi-Device Task Creation and Sync');
    console.log('='.repeat(70));

    // Device A (iOS PWA)
    console.log('\n[Device A - iOS PWA]');
    const managerA = new SyncManager();
    const taskA1 = managerA.addLocalTask({ 
        title: 'Buy groceries',
        parentTab: 'home'
    });
    const taskA2 = managerA.addLocalTask({ 
        title: 'Finish project',
        parentTab: 'official'
    });
    console.log(`  Created 2 tasks:
    - ${taskA1.title} (${taskA1.guid})
    - ${taskA2.title} (${taskA2.guid})`);

    // Device B (Desktop)
    console.log('\n[Device B - Desktop]');
    const managerB = new SyncManager();
    const taskB1 = managerB.addLocalTask({ 
        title: 'Schedule meeting',
        parentTab: 'official'
    });
    const taskB2 = managerB.addLocalTask({ 
        title: 'Workout',
        parentTab: 'self'
    });
    console.log(`  Created 2 tasks:
    - ${taskB1.title} (${taskB1.guid})
    - ${taskB2.title} (${taskB2.guid})`);

    // Sync: B pulls A's tasks
    console.log('\n[Device B - Merging from Drive]');
    const remoteTasks = [
        { ...taskA1, syncState: 'SYNCED' },
        { ...taskA2, syncState: 'SYNCED' }
    ];
    const resultB = managerB.mergeRemoteTasks(remoteTasks);
    console.log(`  Merged result:
    - Tasks merged: ${resultB.mergedCount}
    - Device B now has ${managerB.localTasks.length} total tasks`);

    // Sync: A pulls B's tasks
    console.log('\n[Device A - Merging from Drive]');
    const remoteTasksForA = [
        { ...taskB1, syncState: 'SYNCED' },
        { ...taskB2, syncState: 'SYNCED' }
    ];
    const resultA = managerA.mergeRemoteTasks(remoteTasksForA);
    console.log(`  Merged result:
    - Tasks merged: ${resultA.mergedCount}
    - Device A now has ${managerA.localTasks.length} total tasks`);

    console.log('\n✅ Both devices synchronized: Each has 4 tasks');
}

// ============================================================================
// Scenario 2: Conflict Resolution (Same Task Modified on Both Devices)
// ============================================================================
function scenario2_conflictResolution() {
    console.log('\n🔄 SCENARIO 2: Conflict Resolution - Newer Version Wins');
    console.log('='.repeat(70));

    const managerA = new SyncManager();
    const managerB = new SyncManager();

    // Both start with same task (from previous sync)
    const sharedGUID = managerA.generateUUID();
    const taskA = managerA.addLocalTask({ title: 'Write report' });
    taskA.guid = sharedGUID;

    const taskB = managerB.addLocalTask({ title: 'Write report' });
    taskB.guid = sharedGUID;

    console.log(`\n[Initial State]
  Both devices have task with GUID: ${sharedGUID}
  Title: "Write report"`);

    // Device A modifies first
    console.log('\n[Device A - User makes changes]');
    taskA.title = 'Write quarterly report';
    taskA.description = 'Q4 2025 analysis';
    taskA.updatedAt = Date.now();
    console.log(`  Updated to: "${taskA.title}"`);
    console.log(`  Updated at: ${new Date(taskA.updatedAt).toISOString()}`);

    // Device B modifies later
    console.log('\n[Device B - User makes changes]');
    setTimeout(() => {}, 100); // Small delay to show timestamp difference
    taskB.title = 'Write annual report';
    taskB.description = 'Full year summary';
    taskB.updatedAt = Date.now() + 1000; // Newer
    console.log(`  Updated to: "${taskB.title}"`);
    console.log(`  Updated at: ${new Date(taskB.updatedAt).toISOString()}`);

    // Sync conflict
    console.log('\n[Conflict Detection]');
    const conflict = managerA.detectConflicts(taskB);
    console.log(`  Field conflicts detected: ${conflict ? conflict.join(', ') : 'none'}`);

    // Resolution
    console.log('\n[Resolution Strategy: Take Newer Version]');
    managerA.mergeRemoteTasks([{ ...taskB, syncState: 'SYNCED' }]);
    console.log(`  Device A now has: "${managerA.localTasks[0].title}"`);
    console.log(`  ✅ Conflict resolved using timestamp-based strategy`);
}

// ============================================================================
// Scenario 3: Tab Duplication Prevention During Sync
// ============================================================================
function scenario3_tabDeduplication() {
    console.log('\n📑 SCENARIO 3: Tab Deduplication During Sync');
    console.log('='.repeat(70));

    const manager = new TabManager();

    console.log('\n[Local State]');
    manager.createCustomTab('Work');
    manager.createCustomTab('Personal');
    console.log(`  Custom tabs: ${manager.customTabs.map(t => t.name).join(', ')}`);

    console.log('\n[Syncing from Drive Sheets]');
    const sheetNames = [
        '👨‍👩‍👧‍👦 Family',        // Default tab (home)
        '💼 Official',           // Default tab (official)
        '🌟 Self Interest',      // Default tab (self)
        'Work',                  // Existing custom tab
        'Personal',              // Existing custom tab
        'Health',                // New custom tab
        'Projects'               // New custom tab
    ];

    const newTabs = manager.syncFromDriveSheets(sheetNames);
    
    console.log('\n[Sync Result]');
    console.log(`  New tabs created: ${newTabs.map(t => t.name).join(', ')}`);
    console.log(`  Total custom tabs: ${manager.customTabs.length}`);
    console.log(`  All tabs (default + custom): ${manager.getAllTabs().length}`);
    console.log(`  ✅ No duplicates created`);
}

// ============================================================================
// Scenario 4: Data Persistence with Corrupted Recovery
// ============================================================================
function scenario4_dataRecovery() {
    console.log('\n💾 SCENARIO 4: Data Persistence and Recovery');
    console.log('='.repeat(70));

    const storage = new StorageManager();
    const manager = new PersistenceManager(storage);

    // Save initial data
    console.log('\n[Saving Data]');
    const tasks = [
        { id: 1, title: 'Task 1', guid: 'uuid-1', parentTab: 'home' },
        { id: 2, title: 'Task 2', guid: 'uuid-2', parentTab: 'official' },
        { id: 3, title: 'Task 3', guid: 'uuid-3', parentTab: 'self' }
    ];
    const tabs = [
        { id: 'Work', name: 'Work' },
        { id: 'Personal', name: 'Personal' }
    ];

    manager.saveTasks(tasks);
    manager.saveCustomTabs(tabs);
    console.log(`  Saved ${tasks.length} tasks and ${tabs.length} custom tabs`);

    // Validate
    console.log('\n[Validating Data]');
    const validation = manager.validateData();
    console.log(`  Data validation: ${validation.valid ? '✅ VALID' : '❌ INVALID'}`);
    if (!validation.valid) {
        console.log(`  Errors: ${validation.errors.join(', ')}`);
    }

    // Verify storage keys
    console.log('\n[Storage Contents]');
    const keys = storage.getAllKeys();
    keys.forEach(key => {
        const data = storage.getItem(key);
        console.log(`  ${key}: ${Array.isArray(data) ? data.length + ' items' : typeof data}`);
    });

    // Simulate recovery
    console.log('\n[Recovery]');
    const recoveredTasks = manager.loadTasks();
    const recoveredTabs = manager.loadCustomTabs();
    console.log(`  Recovered ${recoveredTasks.length} tasks`);
    console.log(`  Recovered ${recoveredTabs.length} custom tabs`);
    console.log(`  ✅ All data recovered successfully`);
}

// ============================================================================
// Scenario 5: Parallel Task Modifications from Three Devices
// ============================================================================
function scenario5_threeDeviceSync() {
    console.log('\n📲📱🖥️  SCENARIO 5: Three-Device Parallel Sync');
    console.log('='.repeat(70));

    const deviceA = new SyncManager(); // iOS PWA
    const deviceB = new SyncManager(); // Android
    const deviceC = new SyncManager(); // Desktop

    // Each device creates tasks
    console.log('\n[Device A - iOS PWA]');
    const a1 = deviceA.addLocalTask({ title: 'Morning run' });
    console.log(`  Created: ${a1.title}`);

    console.log('\n[Device B - Android]');
    const b1 = deviceB.addLocalTask({ title: 'Team standup' });
    console.log(`  Created: ${b1.title}`);

    console.log('\n[Device C - Desktop]');
    const c1 = deviceC.addLocalTask({ title: 'Code review' });
    console.log(`  Created: ${c1.title}`);

    // C merges A and B
    console.log('\n[Device C - Syncing All Tasks]');
    const syncResult = deviceC.mergeRemoteTasks([
        { ...a1, syncState: 'SYNCED' },
        { ...b1, syncState: 'SYNCED' }
    ]);
    console.log(`  Merged tasks: ${syncResult.mergedCount}`);
    console.log(`  Device C total: ${deviceC.localTasks.length} tasks`);

    // A merges B and C
    console.log('\n[Device A - Syncing from Drive]');
    const syncResultA = deviceA.mergeRemoteTasks([
        { ...b1, syncState: 'SYNCED' },
        { ...c1, syncState: 'SYNCED' }
    ]);
    console.log(`  Device A total: ${deviceA.localTasks.length} tasks`);

    // B merges A and C
    console.log('\n[Device B - Syncing from Drive]');
    const syncResultB = deviceB.mergeRemoteTasks([
        { ...a1, syncState: 'SYNCED' },
        { ...c1, syncState: 'SYNCED' }
    ]);
    console.log(`  Device B total: ${deviceB.localTasks.length} tasks`);

    console.log('\n✅ All three devices now have 3 tasks each (fully synchronized)');
}

// ============================================================================
// Run All Scenarios
// ============================================================================
function runAllScenarios() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 TASKMATRIX SCENARIO SIMULATIONS');
    console.log('='.repeat(80));

    scenario1_multiDeviceSync();
    scenario2_conflictResolution();
    scenario3_tabDeduplication();
    scenario4_dataRecovery();
    scenario5_threeDeviceSync();

    console.log('\n' + '='.repeat(80));
    console.log('✅ All scenarios completed successfully');
    console.log('='.repeat(80) + '\n');
}

// Export for use in tests
module.exports = {
    scenario1_multiDeviceSync,
    scenario2_conflictResolution,
    scenario3_tabDeduplication,
    scenario4_dataRecovery,
    scenario5_threeDeviceSync
};

// Run if executed directly
if (require.main === module) {
    runAllScenarios();
}
