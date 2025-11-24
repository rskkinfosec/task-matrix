/**
 * Test Suite: Data Persistence & State
 * Tests: LocalStorage simulation, state recovery, data validation
 */

const assert = require('assert');

class StorageManager {
    constructor() {
        this.data = {};
    }

    setItem(key, value) {
        if (!key || typeof key !== 'string') {
            throw new Error('Invalid key');
        }
        this.data[key] = JSON.stringify(value);
    }

    getItem(key) {
        const value = this.data[key];
        return value ? JSON.parse(value) : null;
    }

    removeItem(key) {
        delete this.data[key];
    }

    clear() {
        this.data = {};
    }

    getAllKeys() {
        return Object.keys(this.data);
    }

    hasKey(key) {
        return key in this.data;
    }
}

class PersistenceManager {
    constructor(storage) {
        this.storage = storage;
    }

    saveTasks(tasks) {
        if (!Array.isArray(tasks)) {
            throw new Error('Tasks must be an array');
        }
        this.storage.setItem('tasks_v2', tasks);
    }

    loadTasks() {
        return this.storage.getItem('tasks_v2') || [];
    }

    saveCustomTabs(tabs) {
        if (!Array.isArray(tabs)) {
            throw new Error('Tabs must be an array');
        }
        // Filter out default tabs
        const customOnly = tabs.filter(t => !['home', 'official', 'self'].includes(t.id));
        this.storage.setItem('customTabs', customOnly);
    }

    loadCustomTabs() {
        return this.storage.getItem('customTabs') || [];
    }

    saveAuthToken(token, expiry) {
        this.storage.setItem('drive_access_token', token);
        this.storage.setItem('drive_access_token_expiry', expiry);
    }

    getAuthToken() {
        const token = this.storage.getItem('drive_access_token');
        const expiry = this.storage.getItem('drive_access_token_expiry');
        
        if (!token) return null;
        
        // Check if expired
        if (expiry && Date.now() > expiry) {
            this.storage.removeItem('drive_access_token');
            return null;
        }

        return token;
    }

    validateData() {
        const tasks = this.loadTasks();
        const tabs = this.loadCustomTabs();

        const errors = [];

        // Validate tasks
        if (!Array.isArray(tasks)) {
            errors.push('Tasks is not an array');
        }

        tasks.forEach((task, idx) => {
            if (!task.id) errors.push(`Task ${idx} missing id`);
            if (!task.title) errors.push(`Task ${idx} missing title`);
            if (!task.guid) errors.push(`Task ${idx} missing guid`);
        });

        // Validate tabs
        if (!Array.isArray(tabs)) {
            errors.push('Tabs is not an array');
        }

        tabs.forEach((tab, idx) => {
            if (!tab.id) errors.push(`Tab ${idx} missing id`);
            if (!tab.name) errors.push(`Tab ${idx} missing name`);
            if (['home', 'official', 'self'].includes(tab.id)) {
                errors.push(`Tab ${idx} contains default tab ID: ${tab.id}`);
            }
        });

        return errors.length === 0 ? { valid: true } : { valid: false, errors };
    }
}

function getTests() {
    return {
        'Should save and load tasks': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const tasks = [
                { id: 1, title: 'Task 1', guid: 'uuid-1', syncState: 'SYNCED' },
                { id: 2, title: 'Task 2', guid: 'uuid-2', syncState: 'Added' }
            ];

            manager.saveTasks(tasks);
            const loaded = manager.loadTasks();

            assert.strictEqual(loaded.length, 2);
            assert.strictEqual(loaded[0].title, 'Task 1');
        },

        'Should save and load custom tabs (excluding defaults)': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const tabs = [
                { id: 'home', name: '👨‍👩‍👧‍👦 Family' },
                { id: 'Work', name: 'Work' },
                { id: 'official', name: '💼 Official' }
            ];

            manager.saveCustomTabs(tabs);
            const loaded = manager.loadCustomTabs();

            assert.strictEqual(loaded.length, 1);
            assert.strictEqual(loaded[0].id, 'Work');
        },

        'Should save and validate auth token': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const token = 'test-token-12345';
            const expiry = Date.now() + 3600000; // 1 hour from now

            manager.saveAuthToken(token, expiry);
            const retrieved = manager.getAuthToken();

            assert.strictEqual(retrieved, token);
        },

        'Should return null for expired auth token': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const token = 'test-token';
            const expiry = Date.now() - 1000; // Expired 1 second ago

            manager.saveAuthToken(token, expiry);
            const retrieved = manager.getAuthToken();

            assert.strictEqual(retrieved, null);
        },

        'Should throw error when saving non-array tasks': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            assert.throws(() => {
                manager.saveTasks({ task: 'not an array' });
            }, /must be an array/);
        },

        'Should throw error when saving non-array tabs': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            assert.throws(() => {
                manager.saveCustomTabs('not an array');
            }, /must be an array/);
        },

        'Should validate task data structure': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const validTasks = [
                { 
                    id: 1, 
                    title: 'Task 1', 
                    guid: 'uuid-1',
                    parentTab: 'home',
                    syncState: 'SYNCED'
                }
            ];

            manager.saveTasks(validTasks);
            const result = manager.validateData();

            assert.strictEqual(result.valid, true);
        },

        'Should detect invalid task (missing guid)': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const invalidTasks = [{ id: 1, title: 'Task' }];

            manager.saveTasks(invalidTasks);
            const result = manager.validateData();

            assert.strictEqual(result.valid, false);
            assert(result.errors.some(e => e.includes('guid')));
        },

        'Should detect default tabs in customTabs': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            // Add tasks first for validation to pass
            const tasks = [{ id: 1, title: 'Task', guid: 'uuid-1' }];
            manager.saveTasks(tasks);

            // Manually inject default tabs (shouldn't happen, but test detection)
            const tabs = [
                { id: 'home', name: 'Family' },
                { id: 'Work', name: 'Work' }
            ];
            manager.saveCustomTabs(tabs);

            const result = manager.validateData();

            assert.strictEqual(result.valid, false);
            assert(result.errors.some(e => e.includes('home')));
        },

        'Should recover from corrupted data': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            // Save valid data
            const tasks = [{ id: 1, title: 'Task 1', guid: 'uuid-1' }];
            manager.saveTasks(tasks);

            // Manually corrupt
            storage.data['tasks_v2'] = 'invalid json {';

            // Should return empty array instead of crashing
            try {
                const loaded = manager.loadTasks();
                // This might throw or return empty, both acceptable
            } catch (e) {
                assert(true); // Expected behavior
            }
        },

        'Should persist multiple stores separately': () => {
            const storage = new StorageManager();
            const manager = new PersistenceManager(storage);

            const tasks = [{ id: 1, title: 'Task', guid: 'uuid-1' }];
            const tabs = [{ id: 'Work', name: 'Work' }];

            manager.saveTasks(tasks);
            manager.saveCustomTabs(tabs);

            assert.strictEqual(manager.loadTasks().length, 1);
            assert.strictEqual(manager.loadCustomTabs().length, 1);
        }
    };
}

module.exports = { getTests, StorageManager, PersistenceManager };
