/**
 * Test Suite: Task Operations
 * Tests: Task creation, deletion, updating, and state management
 */

const assert = require('assert');

class TaskModel {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    createTask(data) {
        const task = {
            id: this.nextId++,
            title: data.title || 'Untitled',
            description: data.description || '',
            parentTab: data.parentTab || 'home',
            quadrant: data.quadrant || 'q1',
            priority: data.priority || 'normal',
            completed: data.completed || false,
            syncState: 'Added',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            guid: this.generateUUID(),
            canonicalHash: this.generateHash(data)
        };
        this.tasks.push(task);
        return task;
    }

    updateTask(id, updates) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) throw new Error(`Task ${id} not found`);
        
        Object.assign(task, updates, {
            syncState: 'Updated',
            updatedAt: new Date().toISOString()
        });
        return task;
    }

    deleteTask(id) {
        const idx = this.tasks.findIndex(t => t.id === id);
        if (idx === -1) throw new Error(`Task ${id} not found`);
        
        const task = this.tasks[idx];
        task.syncState = 'Deleted';
        this.tasks.splice(idx, 1);
        return task;
    }

    getTask(id) {
        return this.tasks.find(t => t.id === id);
    }

    getAllTasks() {
        return [...this.tasks];
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    generateHash(data) {
        const str = `${data.title}|${data.description}|${data.quadrant}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }
}

function getTests() {
    const model = new TaskModel();

    return {
        'Should create a task': () => {
            const task = model.createTask({
                title: 'Test Task 1',
                description: 'Test Description',
                parentTab: 'home'
            });

            assert.strictEqual(task.title, 'Test Task 1');
            assert.strictEqual(task.syncState, 'Added');
            assert.strictEqual(model.tasks.length, 1);
        },

        'Should create multiple tasks': () => {
            const newModel = new TaskModel();
            newModel.createTask({ title: 'Task 1' });
            newModel.createTask({ title: 'Task 2' });
            newModel.createTask({ title: 'Task 3' });

            assert.strictEqual(newModel.tasks.length, 3);
            assert.strictEqual(newModel.tasks[0].id, 1);
            assert.strictEqual(newModel.tasks[2].id, 3);
        },

        'Should update task fields': () => {
            const newModel = new TaskModel();
            const task = newModel.createTask({ title: 'Original' });
            
            newModel.updateTask(task.id, {
                title: 'Updated',
                completed: true
            });

            const updated = newModel.getTask(task.id);
            assert.strictEqual(updated.title, 'Updated');
            assert.strictEqual(updated.completed, true);
            assert.strictEqual(updated.syncState, 'Updated');
        },

        'Should delete a task': () => {
            const newModel = new TaskModel();
            const task1 = newModel.createTask({ title: 'Task 1' });
            const task2 = newModel.createTask({ title: 'Task 2' });

            newModel.deleteTask(task1.id);

            assert.strictEqual(newModel.tasks.length, 1);
            assert.strictEqual(newModel.tasks[0].id, 2);
        },

        'Should throw error when updating non-existent task': () => {
            const newModel = new TaskModel();
            assert.throws(() => {
                newModel.updateTask(999, { title: 'No task' });
            }, /not found/);
        },

        'Should throw error when deleting non-existent task': () => {
            const newModel = new TaskModel();
            assert.throws(() => {
                newModel.deleteTask(999);
            }, /not found/);
        },

        'Should generate unique GUIDs': () => {
            const newModel = new TaskModel();
            const task1 = newModel.createTask({ title: 'Task 1' });
            const task2 = newModel.createTask({ title: 'Task 2' });

            assert.notStrictEqual(task1.guid, task2.guid);
        },

        'Should set correct timestamps': () => {
            const newModel = new TaskModel();
            const before = new Date();
            const task = newModel.createTask({ title: 'Task' });
            const after = new Date();

            const createdTime = new Date(task.createdAt);
            assert(createdTime >= before && createdTime <= after);
        }
    };
}

module.exports = { getTests, TaskModel };
