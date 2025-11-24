/**
 * Test Suite: Sync & Merge Operations
 * Tests: Conflict resolution, GUID-based deduplication, multi-device scenarios
 */

const assert = require('assert');

class SyncManager {
    constructor() {
        this.localTasks = [];
        this.remoteTaskId = 1;
    }

    addLocalTask(data) {
        const task = {
            id: Date.now(),
            title: data.title,
            description: data.description || '',
            parentTab: data.parentTab || 'home',
            guid: this.generateUUID(),
            canonicalHash: this.generateHash(data),
            syncState: 'Added',
            updatedAt: Date.now(),
            fieldUpdatedAt: {}
        };
        this.localTasks.push(task);
        return task;
    }

    addRemoteTask(data) {
        const task = {
            id: this.remoteTaskId++,
            title: data.title,
            description: data.description || '',
            parentTab: data.parentTab || 'home',
            guid: data.guid || this.generateUUID(),
            canonicalHash: this.generateHash(data),
            syncState: 'SYNCED',
            updatedAt: Date.now(),
            fieldUpdatedAt: {}
        };
        return task;
    }

    // Simulate merging remote tasks into local
    mergeRemoteTasks(remoteTasks) {
        const mergeLog = [];
        let mergedCount = 0;
        let skippedCount = 0;

        remoteTasks.forEach(remoteTask => {
            // Check if exists by GUID
            const existsByGuid = remoteTask.guid ? 
                this.localTasks.find(l => l.guid === remoteTask.guid) : null;

            if (existsByGuid) {
                // Merge: update with newer fields
                const localTask = existsByGuid;
                if (remoteTask.updatedAt > localTask.updatedAt) {
                    Object.assign(localTask, {
                        title: remoteTask.title,
                        description: remoteTask.description,
                        updatedAt: remoteTask.updatedAt,
                        syncState: 'SYNCED'
                    });
                    mergeLog.push(`Merged (GUID): ${remoteTask.title}`);
                    mergedCount++;
                } else {
                    skippedCount++;
                }
            } else {
                // New task from remote
                const newTask = { ...remoteTask, syncState: 'SYNCED' };
                this.localTasks.push(newTask);
                mergeLog.push(`Added: ${remoteTask.title}`);
                mergedCount++;
            }
        });

        return { mergedCount, skippedCount, log: mergeLog };
    }

    // Detect conflicts between local and remote
    detectConflicts(remoteTask) {
        const localTask = this.localTasks.find(t => t.guid === remoteTask.guid);
        
        if (!localTask) return null;

        const conflicts = [];
        if (localTask.title !== remoteTask.title && 
            localTask.updatedAt !== remoteTask.updatedAt) {
            conflicts.push('title');
        }
        if (localTask.description !== remoteTask.description && 
            localTask.updatedAt !== remoteTask.updatedAt) {
            conflicts.push('description');
        }

        return conflicts.length > 0 ? conflicts : null;
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    generateHash(data) {
        const str = `${data.title}|${data.description}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
        }
        return hash.toString(16);
    }
}

function getTests() {
    return {
        'Should add local task': () => {
            const manager = new SyncManager();
            const task = manager.addLocalTask({ title: 'Local Task' });

            assert.strictEqual(task.title, 'Local Task');
            assert.strictEqual(task.syncState, 'Added');
            assert.ok(task.guid);
        },

        'Should add remote task': () => {
            const manager = new SyncManager();
            const task = manager.addRemoteTask({ title: 'Remote Task' });

            assert.strictEqual(task.title, 'Remote Task');
            assert.strictEqual(task.syncState, 'SYNCED');
        },

        'Should merge new remote task into local': () => {
            const manager = new SyncManager();
            const remoteTask = manager.addRemoteTask({ title: 'Remote' });

            const result = manager.mergeRemoteTasks([remoteTask]);

            assert.strictEqual(result.mergedCount, 1);
            assert.strictEqual(manager.localTasks.length, 1);
        },

        'Should skip merging if remote is older': () => {
            const manager = new SyncManager();
            const localTask = manager.addLocalTask({ title: 'Local' });
            
            const remoteTask = {
                guid: localTask.guid,
                title: 'Remote Old',
                description: '',
                updatedAt: Date.now() - 10000 // Older
            };

            manager.mergeRemoteTasks([remoteTask]);

            // Local task should keep its title
            assert.strictEqual(manager.localTasks[0].title, 'Local');
        },

        'Should merge multiple remote tasks': () => {
            const manager = new SyncManager();
            const remote1 = manager.addRemoteTask({ title: 'Task 1' });
            const remote2 = manager.addRemoteTask({ title: 'Task 2' });
            const remote3 = manager.addRemoteTask({ title: 'Task 3' });

            const result = manager.mergeRemoteTasks([remote1, remote2, remote3]);

            assert.strictEqual(result.mergedCount, 3);
            assert.strictEqual(manager.localTasks.length, 3);
        },

        'Should detect title conflict': () => {
            const manager = new SyncManager();
            const local = manager.addLocalTask({ title: 'Local Title' });
            
            const remote = {
                guid: local.guid,
                title: 'Remote Title',
                description: local.description,
                updatedAt: local.updatedAt + 1000 // Newer
            };

            const conflicts = manager.detectConflicts(remote);
            assert(conflicts && conflicts.includes('title'));
        },

        'Should detect description conflict': () => {
            const manager = new SyncManager();
            const local = manager.addLocalTask({ 
                title: 'Task',
                description: 'Local desc'
            });
            
            const remote = {
                guid: local.guid,
                title: local.title,
                description: 'Remote desc',
                updatedAt: local.updatedAt + 1000
            };

            const conflicts = manager.detectConflicts(remote);
            assert(conflicts && conflicts.includes('description'));
        },

        'Should not detect conflict if only timestamp differs': () => {
            const manager = new SyncManager();
            const local = manager.addLocalTask({ title: 'Task' });
            
            const remote = {
                guid: local.guid,
                title: local.title,
                description: local.description,
                updatedAt: local.updatedAt + 1000 // Same content, different time
            };

            const conflicts = manager.detectConflicts(remote);
            assert.strictEqual(conflicts, null);
        },

        'Should handle GUID-based deduplication': () => {
            const manager = new SyncManager();
            const local = manager.addLocalTask({ title: 'Task' });
            const guid = local.guid;

            // Simulate same task from remote with same GUID
            const remote = {
                guid: guid,
                title: 'Task Updated',
                description: '',
                canonicalHash: manager.generateHash({ title: 'Task Updated', description: '' }),
                updatedAt: Date.now() + 1000, // Newer
                syncState: 'SYNCED'
            };

            const result = manager.mergeRemoteTasks([remote]);

            assert.strictEqual(result.mergedCount, 1); // Merged existing task (found by GUID)
            assert.strictEqual(manager.localTasks.length, 1); // No duplicate
            assert.strictEqual(manager.localTasks[0].title, 'Task Updated'); // Updated
        },

        'Should simulate parallel modifications from Device A': () => {
            const manager = new SyncManager();
            
            // Device A creates 2 tasks locally
            const task1 = manager.addLocalTask({ title: 'Device A Task 1' });
            const task2 = manager.addLocalTask({ title: 'Device A Task 2' });

            assert.strictEqual(manager.localTasks.length, 2);
            assert(task1.guid);
            assert(task2.guid);
        },

        'Should simulate parallel modifications from Device B': () => {
            const managerA = new SyncManager();
            const managerB = new SyncManager();

            // Both devices create tasks
            const taskA = managerA.addLocalTask({ title: 'Device A Task' });
            const taskB = managerB.addLocalTask({ title: 'Device B Task' });

            assert.strictEqual(managerA.localTasks.length, 1);
            assert.strictEqual(managerB.localTasks.length, 1);
        },

        'Should merge tasks from Device B into Device A': () => {
            const managerA = new SyncManager();
            const managerB = new SyncManager();

            // B creates task and syncs to remote
            const taskB = managerB.addLocalTask({ title: 'Device B Task' });
            const remoteTask = {
                guid: taskB.guid,
                title: taskB.title,
                description: taskB.description,
                updatedAt: taskB.updatedAt,
                fieldUpdatedAt: {},
                syncState: 'SYNCED'
            };

            // A merges remote tasks
            managerA.mergeRemoteTasks([remoteTask]);

            assert.strictEqual(managerA.localTasks.length, 1);
            assert.strictEqual(managerA.localTasks[0].title, 'Device B Task');
        },

        'Should handle conflict resolution: take newer version': () => {
            const manager = new SyncManager();
            const local = manager.addLocalTask({ title: 'Old Title' });
            const oldUpdatedAt = local.updatedAt;

            const remote = {
                guid: local.guid,
                title: 'New Title',
                description: '',
                updatedAt: oldUpdatedAt + 1000 // Newer timestamp
            };

            // Merge would take newer
            manager.mergeRemoteTasks([{ 
                ...remote, 
                canonicalHash: manager.generateHash(remote),
                syncState: 'SYNCED'
            }]);

            assert.strictEqual(manager.localTasks[0].title, 'New Title');
        }
    };
}

module.exports = { getTests, SyncManager };
