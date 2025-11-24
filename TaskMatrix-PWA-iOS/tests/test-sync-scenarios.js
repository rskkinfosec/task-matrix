/**
 * Sync State Manager for Testing
 * Simulates task state and sync operations across multiple devices
 */

const assert = require('assert');

class SyncStateManager {
    constructor(deviceId) {
        this.deviceId = deviceId;
        this.tasks = [];
        this.lastSyncTimestamp = 0;
        this.syncHistory = [];
    }

    addTask(title, description = '') {
        const task = {
            id: Date.now() + Math.random(),
            title,
            description,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            syncState: 'Added',
            guid: this._generateGUID()
        };
        this.tasks.push(task);
        return task;
    }

    updateTask(taskId, updates) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) throw new Error(`Task ${taskId} not found`);
        
        Object.assign(task, updates, {
            updatedAt: new Date().toISOString(),
            syncState: 'Updated'
        });
        return task;
    }

    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index === -1) throw new Error(`Task ${taskId} not found`);
        
        this.tasks[index].syncState = 'Deleted';
        return true;
    }

    sync(remoteState = null) {
        const syncRecord = {
            timestamp: Date.now(),
            deviceId: this.deviceId,
            localTaskCount: this.tasks.length,
            syncedTasks: [],
            action: 'sync'
        };

        // Mark synced tasks
        this.tasks.forEach(task => {
            if (task.syncState !== 'Deleted') {
                task.syncState = 'SYNCED';
                syncRecord.syncedTasks.push(task.id);
            }
        });

        this.lastSyncTimestamp = syncRecord.timestamp;
        this.syncHistory.push(syncRecord);
        
        return syncRecord;
    }

    mergeRemoteState(remoteState) {
        remoteState.tasks.forEach(remoteTask => {
            const localTask = this.tasks.find(t => t.guid === remoteTask.guid);
            
            if (localTask) {
                // Merge based on timestamp
                if (remoteTask.updatedAt >= localTask.updatedAt) {
                    // Preserve delete state if remote is deleted
                    if (remoteTask.syncState === 'Deleted') {
                        localTask.syncState = 'Deleted';
                    } else {
                        Object.assign(localTask, remoteTask, { syncState: 'SYNCED' });
                    }
                }
            } else {
                // New remote task
                this.tasks.push({ ...remoteTask, syncState: remoteTask.syncState === 'Deleted' ? 'Deleted' : 'SYNCED' });
            }
        });
    }

    getSyncHistory() {
        return this.syncHistory;
    }

    getTasksSyncState() {
        return {
            added: this.tasks.filter(t => t.syncState === 'Added').length,
            updated: this.tasks.filter(t => t.syncState === 'Updated').length,
            deleted: this.tasks.filter(t => t.syncState === 'Deleted').length,
            synced: this.tasks.filter(t => t.syncState === 'SYNCED').length,
            total: this.tasks.length
        };
    }

    _generateGUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

module.exports = { SyncStateManager };
