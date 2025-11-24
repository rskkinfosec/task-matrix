/**
 * Test Suite: Tab Management
 * Tests: Tab creation, deletion, deduplication, and rendering
 */

const assert = require('assert');

class TabManager {
    constructor() {
        this.customTabs = [];
        this.defaultTabs = {
            'home': '👨‍👩‍👧‍👦 Family',
            'official': '💼 Official',
            'self': '🌟 Self Interest'
        };
        this.DEFAULT_TAB_IDS = new Set(['home', 'official', 'self']);
        this.DISPLAY_NAME_MAP = {
            'family': 'home',
            'official': 'official',
            'selfinterest': 'self'
        };
    }

    createCustomTab(name) {
        // Validate - no reserved names
        const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (this.DEFAULT_TAB_IDS.has(normalized) || this.DISPLAY_NAME_MAP[normalized]) {
            throw new Error(`Cannot create tab: "${name}" is reserved`);
        }

        // Check if tab already exists
        if (this.customTabs.find(t => t.name.toLowerCase() === name.toLowerCase())) {
            throw new Error(`Tab "${name}" already exists`);
        }

        const tab = { id: name, name: name };
        this.customTabs.push(tab);
        return tab;
    }

    deleteCustomTab(tabId) {
        // Prevent deletion of default tabs
        if (this.DEFAULT_TAB_IDS.has(tabId)) {
            throw new Error(`Cannot delete default tab: "${tabId}"`);
        }
        
        const idx = this.customTabs.findIndex(t => t.id === tabId);
        if (idx === -1) throw new Error(`Tab "${tabId}" not found`);

        const tab = this.customTabs[idx];
        this.customTabs.splice(idx, 1);
        return tab;
    }

    deduplicateTabs() {
        const seen = new Set();
        const deduplicated = [];

        this.customTabs.forEach(tab => {
            // Skip default tabs
            if (this.DEFAULT_TAB_IDS.has(tab.id)) {
                return;
            }

            // Check if maps to default tab
            const normalized = tab.id.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (this.DISPLAY_NAME_MAP[normalized]) {
                return;
            }

            const normalizedName = tab.name.toLowerCase().trim();
            if (!seen.has(normalizedName)) {
                seen.add(normalizedName);
                deduplicated.push(tab);
            }
        });

        this.customTabs = deduplicated;
    }

    getAllTabs() {
        const tabs = Object.entries(this.defaultTabs).map(([id, name]) => ({
            id, name, isDefault: true
        }));
        tabs.push(...this.customTabs.map(t => ({ ...t, isDefault: false })));
        return tabs;
    }

    syncFromDriveSheets(sheetNames) {
        const newTabs = [];

        sheetNames.forEach(sheetName => {
            const tabName = sheetName.toLowerCase().replace(/[^a-z0-9]/g, '');

            // Check if it's a default tab
            if (this.DISPLAY_NAME_MAP[tabName]) {
                const defaultTabId = this.DISPLAY_NAME_MAP[tabName];
                console.log(`  Mapped "${sheetName}" → default tab "${defaultTabId}"`);
                return; // Don't create custom tab
            }

            // Check if custom tab already exists
            const existing = this.customTabs.find(t => 
                t.name.toLowerCase() === sheetName.toLowerCase()
            );

            if (!existing) {
                const newTab = { id: sheetName, name: sheetName };
                this.customTabs.push(newTab);
                newTabs.push(newTab);
            }
        });

        return newTabs;
    }
}

function getTests() {
    return {
        'Should create a custom tab': () => {
            const manager = new TabManager();
            const tab = manager.createCustomTab('Projects');

            assert.strictEqual(tab.name, 'Projects');
            assert.strictEqual(manager.customTabs.length, 1);
        },

        'Should create multiple custom tabs': () => {
            const manager = new TabManager();
            manager.createCustomTab('Work');
            manager.createCustomTab('Personal');
            manager.createCustomTab('Health');

            assert.strictEqual(manager.customTabs.length, 3);
        },

        'Should prevent creating tab with reserved name "Family"': () => {
            const manager = new TabManager();
            assert.throws(() => {
                manager.createCustomTab('Family');
            }, /reserved/);
        },

        'Should prevent creating tab with reserved name "Official"': () => {
            const manager = new TabManager();
            assert.throws(() => {
                manager.createCustomTab('Official');
            }, /reserved/);
        },

        'Should prevent creating tab with reserved name "Self Interest"': () => {
            const manager = new TabManager();
            assert.throws(() => {
                manager.createCustomTab('Self Interest');
            }, /reserved/);
        },

        'Should prevent creating duplicate tabs': () => {
            const manager = new TabManager();
            manager.createCustomTab('Work');
            
            assert.throws(() => {
                manager.createCustomTab('Work');
            }, /already exists/);
        },

        'Should delete custom tab': () => {
            const manager = new TabManager();
            manager.createCustomTab('Temp');
            
            manager.deleteCustomTab('Temp');
            assert.strictEqual(manager.customTabs.length, 0);
        },

        'Should prevent deleting default tabs': () => {
            const manager = new TabManager();
            assert.throws(() => {
                manager.deleteCustomTab('home');
            }, /Cannot delete default tab/);
        },

        'Should get all tabs (default + custom)': () => {
            const manager = new TabManager();
            manager.createCustomTab('Work');
            manager.createCustomTab('Personal');

            const allTabs = manager.getAllTabs();
            assert.strictEqual(allTabs.length, 5); // 3 default + 2 custom
            assert.strictEqual(allTabs.filter(t => t.isDefault).length, 3);
            assert.strictEqual(allTabs.filter(t => !t.isDefault).length, 2);
        },

        'Should deduplicate tabs by name': () => {
            const manager = new TabManager();
            manager.createCustomTab('Work');
            manager.customTabs.push({ id: 'work', name: 'work' }); // Duplicate
            manager.customTabs.push({ id: 'Work2', name: 'WORK' }); // Another duplicate (case-insensitive)

            manager.deduplicateTabs();
            assert.strictEqual(manager.customTabs.length, 1);
        },

        'Should sync sheets from Drive and create only new custom tabs': () => {
            const manager = new TabManager();
            const newTabs = manager.syncFromDriveSheets([
                '👨‍👩‍👧‍👦 Family',
                '💼 Official',
                'Work',
                '🌟 Self Interest',
                'Personal'
            ]);

            // Should only create 'Work' and 'Personal' as custom tabs
            assert.strictEqual(manager.customTabs.length, 2);
            assert.strictEqual(newTabs.length, 2);
        },

        'Should not create duplicate tabs during sync from Drive': () => {
            const manager = new TabManager();
            manager.createCustomTab('Work');

            manager.syncFromDriveSheets(['Work', 'Personal']);

            assert.strictEqual(manager.customTabs.length, 2);
        },

        'Should map display names to default tabs during sync': () => {
            const manager = new TabManager();
            const newTabs = manager.syncFromDriveSheets(['Family', 'Official', 'Self Interest']);

            // No new custom tabs should be created
            assert.strictEqual(manager.customTabs.length, 0);
            assert.strictEqual(newTabs.length, 0);
        }
    };
}

module.exports = { getTests, TabManager };
